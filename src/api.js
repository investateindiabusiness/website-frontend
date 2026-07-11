// Use NEXT_PUBLIC_API_BASE_URL directly. In local dev with rewrites, it can be empty.
// In production (Netlify), it must point to the actual backend URL.
const API_BASE_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_BASE_URL || '');

const isProtectedRoute = (path) => {
  if (!path) return false;
  const isAdminRoute = path.startsWith('/admin') && path !== '/admin/login';
  const isBuilderRoute = (path.startsWith('/builder/') && path !== '/builder/login' && path !== '/builder/register') || path === '/builder/dashboard' || path === '/builder/projects' || path === '/builder/advertisements';
  const isInvestorRoute = path === '/dashboard' || path === '/properties' || (path.startsWith('/investor/') && path !== '/investor/login' && path !== '/investor/register') || path.startsWith('/project/');
  const isServiceProviderRoute = (path.startsWith('/service-provider/') && path !== '/service-provider' && path !== '/service-provider/login' && path !== '/service-provider/register') || path === '/service-provider/dashboard' || path === '/service-provider/advertisements';

  return isAdminRoute || isBuilderRoute || isInvestorRoute || isServiceProviderRoute;
};

// ---------------------------------------------------------------------------
// Token refresh infrastructure
// ---------------------------------------------------------------------------

/**
 * Decode the exp claim from a JWT without verifying the signature.
 * Returns the expiry as a Unix timestamp (ms), or 0 on failure.
 */
const getTokenExpiry = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return (payload.exp || 0) * 1000; // convert to ms
  } catch {
    return 0;
  }
};

/**
 * Singleton refresh lock. While a refresh is in-flight, all concurrent
 * API calls will await this promise rather than each kicking off their own.
 */
let _refreshPromise = null;

/**
 * Exchange a Firebase refresh token for a fresh ID token.
 * Stores the new token + expiry back into sessionStorage.
 * Returns the new idToken string, or null if the refresh fails.
 */
const silentRefresh = async () => {
  // Reuse an in-flight refresh rather than sending duplicate requests
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) return null;

      const data = await response.json();
      if (!data.success) return null;

      // Persist the refreshed token expiry estimate back to storage
      const newExpiry = Date.now() + (data.expiresIn || 3600) * 1000;
      if (typeof window !== 'undefined') {
        try {
          const current = JSON.parse(localStorage.getItem('user_session')) || {};
          current.expiresAt = newExpiry;
          localStorage.setItem('user_session', JSON.stringify(current));
          window.dispatchEvent(new Event('user_session_updated'));
        } catch {}
      }
      return "refreshed";
    } catch {
      return null;
    } finally {
      _refreshPromise = null;
    }
  })();

  return _refreshPromise;
};

/**
 * Redirect the user to the appropriate login page, preserving role context.
 */
const redirectToLogin = (role, reason = 'session_expired') => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user_session');
  window.dispatchEvent(new Event('user_session_updated'));
  const currentPath = window.location.pathname;
  if (!isProtectedRoute(currentPath)) return;

  if (role === 'admin') {
    window.location.href = `/admin/login?${reason}=true`;
  } else if (role === 'builder') {
    window.location.href = `/builder/login?${reason}=true`;
  } else if (role === 'serviceProvider') {
    window.location.href = `/service-provider/login?${reason}=true`;
  } else {
    window.location.href = `/investor/login?${reason}=true`;
  }
};

// ---------------------------------------------------------------------------
// Core API request helper
// ---------------------------------------------------------------------------

export const apiRequest = async (endpoint, options = {}, _isRetry = false) => {
  let session = null;
  if (typeof window !== 'undefined') {
    try {
      session = JSON.parse(localStorage.getItem('user_session'));
    } catch (e) {
      console.warn('Failed to parse user session:', e);
    }
  }

  // ── Proactive refresh ─────────────────────────────────────────────────────
  // If the token is within 5 minutes of expiry (or already expired) and this
  // is NOT itself an auth/refresh call, try to refresh before the request.
  const isAuthEndpoint =
    endpoint.includes('/login') ||
    endpoint.includes('/google-sync') ||
    endpoint.includes('/admin-login') ||
    endpoint.includes('/refresh-token');

  if (!isAuthEndpoint && !_isRetry && session?.expiresAt) {
    const fiveMinutes = 5 * 60 * 1000;
    if (Date.now() >= session.expiresAt - fiveMinutes) {
      const newToken = await silentRefresh();
      if (newToken) {
        // Re-read session after refresh so the request uses the fresh token
        try {
          session = JSON.parse(localStorage.getItem('user_session'));
        } catch { /* ignore */ }
      } else if (Date.now() >= session.expiresAt) {
        // Token is already expired and refresh failed — bail out now
        redirectToLogin(session?.role);
        return Promise.reject('Session expired');
      }
    }
  }
  // ──────────────────────────────────────────────────────────────────────────

  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    ...(session?.token && { 'Authorization': `Bearer ${session.token}` }),
    ...options.headers,
  };

  // Defensive guard: if caller passed an invalid Authorization header (e.g. Bearer undefined),
  // fall back to the session token to prevent spurious 401s.
  if (headers['Authorization'] && (headers['Authorization'].includes('undefined') || headers['Authorization'].includes('null'))) {
    if (session?.token) {
      headers['Authorization'] = `Bearer ${session.token}`;
    } else {
      delete headers['Authorization'];
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      cache: 'no-store',
      ...options,
      headers,
    });

    const data = await response.json();

    if (response.status === 401) {
      if (!isAuthEndpoint) {
        // ── Reactive refresh ────────────────────────────────────────────────
        // The server rejected the token. Attempt one silent refresh and retry.
        if (!_isRetry) {
          const newToken = await silentRefresh();
          if (newToken) {
            return apiRequest(endpoint, options, true); // retry once
          }
        }
        // ────────────────────────────────────────────────────────────────────
        redirectToLogin(session?.role);
        return Promise.reject('Session expired');
      } else {
        return Promise.reject({ message: data.message || 'Authentication failed', ...data });
      }
    }

    if (!response.ok) {
      // If the backend sent ANY custom error flag, return the whole object to the component
      if (data.error) {
        return Promise.reject(data);
      }
      // Otherwise, reject with a plain object containing the message
      return Promise.reject({ message: data.message || 'Something went wrong', ...data });
    }

    return data;
  } catch (error) {
    console.warn('API Request Error:', error);
    throw error;
  }
};

export const apiUploadRequest = async (endpoint, formData) => {
  let session = null;
  if (typeof window !== 'undefined') {
    try {
      session = JSON.parse(localStorage.getItem('user_session'));
    } catch (e) {
      console.warn("Failed to parse user session:", e);
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...(session?.token ? { 'Authorization': `Bearer ${session.token}` } : {})
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {}
    throw new Error(errorMessage);
  }

  return response.json();
};

// --- Auth Endpoints ---

export const submitInvestorForm1 = (uid, profileData) =>
  apiRequest(`/api/auth/investor-form1/${uid}`, {
    method: 'POST',
    body: JSON.stringify(profileData),
  });

export const submitBuilderForm1 = (uid, profileData) =>
  apiRequest(`/api/auth/builder-form1/${uid}`, {
    method: 'POST',
    body: JSON.stringify(profileData),
  });

// Fetch all Investors (paginated)
export const fetchAllInvestors = async (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiRequest(`/api/investors${qs ? `?${qs}` : ''}`);
};

export const submitRequestedChanges = (uid, data) =>
  apiRequest(`/api/auth/submit-changes/${uid}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const submitBuilderForm2 = (uid, data) =>
  apiRequest(`/api/auth/builder-form2/${uid}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const submitInvestorForm2 = (uid, data) =>
  apiRequest(`/api/auth/investor-form2/${uid}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });


// You can reuse the generic apiRequest for these action triggers:
export const approveInvestorForm1 = (uid) =>
  apiRequest(`/api/investors/approve-investor-form1/${uid}`, { method: 'POST' });

export const requestInvestorChanges = (uid, fieldsRequested) =>
  apiRequest(`/api/investors/request-investor-changes/${uid}`, {
    method: 'POST',
    body: JSON.stringify({ fieldsRequested })
  });

export const verifyInvestorFinal = (uid, isVerified) =>
  apiRequest(`/api/investors/verify-investor-final/${uid}`, {
    method: 'POST',
    body: JSON.stringify({ isVerified })
  });

export const loginRequest = (payload) =>
  apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const adminLoginRequest = (payload) =>
  apiRequest('/api/auth/admin-login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const logoutRequest = () =>
  apiRequest('/api/auth/logout', {
    method: 'POST',
  });

export const googleSyncRequest = async (idToken, role) => {
  return apiRequest('/api/auth/google-sync', {
    method: 'POST',
    body: JSON.stringify({ idToken, role }),
  });
};

// --- Unified Registration Endpoints ---

export const registerStep1 = (authData) =>
  apiRequest('/api/auth/register-step1', {
    method: 'POST',
    body: JSON.stringify(authData),
  });

export const updateProfileStep2 = (uid, profileData) =>
  apiRequest(`/api/auth/register-step2/${uid}`, {
    method: 'POST',
    body: JSON.stringify(profileData),
  });

// --- Admin Data Endpoints ---

// Fetch all Builders (paginated)
export const fetchAllBuilders = async (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiRequest(`/api/builders${qs ? `?${qs}` : ''}`);
};

export const verifyBuilderStatus = async (uid, isVerified, token) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/verify-builder/${uid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ isVerified })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update verification status');
  }

  return response.json();
};

// Fetch builder's own projects (paginated)
export const fetchBuilderProjects = async (builderId, params = {}) => {
  const qs = new URLSearchParams({ builderId, ...params }).toString();
  return apiRequest(`/api/projects?${qs}`);
};

export const createProject = async (projectData) => {
  return apiRequest('/api/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
};

export const updateProject = async (projectId, projectData) => {
  return apiRequest(`/api/projects/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify(projectData),
  });
};

export const deleteProject = async (projectId) => {
  return apiRequest(`/api/projects/${projectId}`, {
    method: 'DELETE',
  });
};

// Fetch ALL projects — Admin (paginated)
export const fetchAllProjects = async (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiRequest(`/api/projects${qs ? `?${qs}` : ''}`);
};

export const verifyProjectStatus = async (projectId, isVerified) => {
  return apiRequest(`/api/projects/verify/${projectId}`, {
    method: 'POST',
    body: JSON.stringify({ status: isVerified ? 'approved' : 'rejected' })
  });
};

export const requestProjectChanges = async (projectId, fieldsRequested) => {
  return apiRequest(`/api/projects/request-changes/${projectId}`, {
    method: 'POST',
    body: JSON.stringify({ fieldsRequested })
  });
};

export const submitProjectChanges = async (projectId, data) => {
  return apiRequest(`/api/projects/submit-changes/${projectId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const appealProjectRejection = async (projectId, appealReason) => {
  return apiRequest(`/api/projects/appeal-rejection/${projectId}`, {
    method: 'POST',
    body: JSON.stringify({ appealReason }),
  });
};

export const verifyProjectEdits = async (projectId, isApproved) => {
  return apiRequest(`/api/projects/verify/${projectId}`, {
    method: 'POST',
    body: JSON.stringify({ action: isApproved ? 'approve_edits' : 'reject_edits' })
  });
};


export const submitProjectLead = async (projectId, payload) => {
  return apiRequest(`/api/projects/${projectId}/lead`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const checkLeadStatus = async (projectId, uid) => {
  return apiRequest(`/api/projects/${projectId}/lead-status?uid=${uid}`);
};

export const fetchAllLeads = async () => {
  return apiRequest('/api/leads');
};

export const updateLead = async (leadId, data) => {
  return apiRequest(`/api/leads/${leadId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteLead = async (leadId) => {
  return apiRequest(`/api/leads/${leadId}`, {
    method: 'DELETE',
  });
};

export const fetchChatbotFaqs = async (audience = 'public') => {
  return apiRequest(`/api/chatbot/faqs?audience=${encodeURIComponent(audience)}`);
};

export const submitChatbotRequest = async (data) => {
  return apiRequest('/api/chatbot/requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const submitContactInquiry = async (data) => {
  return apiRequest('/api/inquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const fetchAllInquiries = async () => {
  return apiRequest('/api/inquiries');
};

export const updateInquiry = async (inquiryId, data) => {
  return apiRequest(`/api/inquiries/${inquiryId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteInquiry = async (inquiryId) => {
  return apiRequest(`/api/inquiries/${inquiryId}`, {
    method: 'DELETE',
  });
};

export const subscribeToNewsletter = async (email) => {
  return apiRequest('/api/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const fetchAllNewsletterSubscribers = async () => {
  return apiRequest('/api/newsletter');
};

export const updateNewsletterSubscriber = async (id, data) => {
  return apiRequest(`/api/newsletter/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteNewsletterSubscriber = async (id) => {
  return apiRequest(`/api/newsletter/${id}`, {
    method: 'DELETE',
  });
};

export const revokeProjectRejection = (projectId) =>
  apiRequest(`/api/projects/verify/${projectId}`, {
    method: 'POST',
    body: JSON.stringify({ status: 'pending' }),
  });

export const approveProject = (projectId, visibleDocuments) =>
  apiRequest(`/api/projects/verify/${projectId}`, {
    method: 'POST',
    body: JSON.stringify({
      status: 'approved',
      visibleDocuments: visibleDocuments,
    }),
  });

// --- Helpdesk Endpoints ---

export const fetchMyTickets = async (status) => {
  const query = status ? `?status=${status}` : '';
  return apiRequest(`/api/helpdesk/my-tickets${query}`);
};

export const fetchAllTickets = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  return apiRequest(`/api/helpdesk/tickets${queryParams ? `?${queryParams}` : ''}`);
};

export const fetchTicketDetails = async (id) => {
  return apiRequest(`/api/helpdesk/tickets/${id}`);
};

export const fetchTicketMessages = async (id) => {
  return apiRequest(`/api/helpdesk/tickets/${id}/messages`);
};

export const createTicket = async (data) => {
  return apiRequest('/api/helpdesk/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const sendTicketMessage = async (id, data) => {
  return apiRequest(`/api/helpdesk/tickets/${id}/messages`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const changeTicketStatus = async (id, status, reason = '') => {
  return apiRequest(`/api/helpdesk/tickets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reason }),
  });
};

export const changeTicketPriority = async (id, priority, reason = '') => {
  return apiRequest(`/api/helpdesk/tickets/${id}/priority`, {
    method: 'PATCH',
    body: JSON.stringify({ priority, reason }),
  });
};

export const assignTicket = async (id, assignedTo, team = '') => {
  return apiRequest(`/api/helpdesk/tickets/${id}/assign`, {
    method: 'POST',
    body: JSON.stringify({ assignedTo, team }),
  });
};

// --- Advertisement Endpoints ---

export const fetchAdZones = () =>
  apiRequest('/api/advertisements/zones');

export const fetchAvailableSlots = (zoneId) =>
  apiRequest(`/api/advertisements/zones/${zoneId}/available-slots`);

export const fetchSlots = (zoneId) =>
  apiRequest(`/api/advertisements/zones/${zoneId}/slots`);

export const bookSlot = (payload) =>
  apiRequest('/api/advertisements/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const fetchMyBookings = () =>
  apiRequest('/api/advertisements/my-bookings');

export const rectifyBooking = (bookingId, payload) =>
  apiRequest(`/api/advertisements/bookings/${bookingId}/rectify`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const cancelBooking = (bookingId) =>
  apiRequest(`/api/advertisements/bookings/${bookingId}/cancel`, {
    method: 'POST',
  });

export const fetchActiveAd = (zoneId) =>
  apiRequest(`/api/advertisements/active-ad/${zoneId}`);

export const createCustomSlot = (zoneId, payload) =>
  apiRequest(`/api/advertisements/zones/${zoneId}/slots`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const deleteCustomSlot = (slotId) =>
  apiRequest(`/api/advertisements/slots/${slotId}`, {
    method: 'DELETE',
  });

export const confirmPayment = (payload) =>
  apiRequest('/api/payments/confirm', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const createPayment = (payload) =>
  apiRequest('/api/payments', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const getMembershipPricing = () =>
  apiRequest('/api/auth/membership-pricing');

export const updateMembershipPricing = (payload) =>
  apiRequest('/api/admin/membership-pricing', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });

// --- UPLOAD ---
export const uploadImage = (file, folder = 'misc') => {
  const formData = new FormData();
  formData.append('image', file);
  return apiUploadRequest(`/api/upload/image?folder=${folder}`, formData);
};

export const uploadFile = (file, folder = 'misc') => {
  const formData = new FormData();
  formData.append('file', file);
  return apiUploadRequest(`/api/upload/file?folder=${folder}`, formData);
};

// --- Admin Advertisement Endpoints ---

export const adminSeedZones = () =>
  apiRequest('/api/admin/advertisements/seed-zones', {
    method: 'POST',
  });

export const adminFetchZones = () =>
  apiRequest('/api/admin/advertisements/zones');

export const adminFetchZoneDetails = (zoneId) =>
  apiRequest(`/api/admin/advertisements/zones/${zoneId}`);

export const adminUpdateZone = (zoneId, payload) =>
  apiRequest(`/api/admin/advertisements/zones/${zoneId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const adminCreateSlot = (zoneId, payload) =>
  apiRequest(`/api/admin/advertisements/zones/${zoneId}/slots`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const adminDeleteSlot = (slotId) =>
  apiRequest(`/api/admin/advertisements/slots/${slotId}`, {
    method: 'DELETE',
  });

export const adminFetchSlots = (zoneId = '') => {
  const query = zoneId ? `?zoneId=${zoneId}` : '';
  return apiRequest(`/api/admin/advertisements/slots${query}`);
};

export const adminFetchBookings = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const query = queryParams ? `?${queryParams}` : '';
  return apiRequest(`/api/admin/advertisements/bookings${query}`);
};

export const adminReviewBooking = (bookingId, payload) =>
  apiRequest(`/api/admin/advertisements/bookings/${bookingId}/review`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

// --- Service Provider Endpoints ---

export const submitServiceProviderForm1 = (uid, profileData) =>
  apiRequest(`/api/auth/service-provider-form1/${uid}`, {
    method: 'POST',
    body: JSON.stringify(profileData),
  });

export const fetchServiceProviderStats = () =>
  apiRequest('/api/service-providers/dashboard-stats');

export const fetchAllServiceProviders = (token) =>
  apiRequest('/api/service-providers', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

export const approveServiceProviderForm1 = (uid) =>
  apiRequest(`/api/service-providers/approve-form1/${uid}`, { method: 'POST' });

export const requestServiceProviderChanges = (uid, fieldsRequested) =>
  apiRequest(`/api/service-providers/request-changes/${uid}`, {
    method: 'POST',
    body: JSON.stringify({ fieldsRequested })
  });

export const verifyServiceProviderFinal = (uid, isVerified) =>
  apiRequest(`/api/service-providers/verify-final/${uid}`, {
    method: 'POST',
    body: JSON.stringify({ isVerified })
  });

// --- Coupons Admin API ---
export const fetchAdminCoupons = () => apiRequest('/api/admin/coupons');
export const createAdminCoupon = (couponData) => apiRequest('/api/admin/coupons', {
  method: 'POST',
  body: JSON.stringify(couponData)
});
export const deleteAdminCoupon = (id) => apiRequest(`/api/admin/coupons/${id}`, {
  method: 'DELETE'
});
export const resetAdminCoupon = (id) => apiRequest(`/api/admin/coupons/${id}/reset`, {
  method: 'PATCH'
});

// --- Coupons User API ---
export const fetchMyCoupons = () => apiRequest('/api/coupons/my-coupons');
export const validateCoupon = (code) => apiRequest('/api/coupons/validate', {
  method: 'POST',
  body: JSON.stringify({ code })
});

// --- Admin Users Search API ---
export const fetchAdminUsers = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/api/admin/users${query ? `?${query}` : ''}`);
};

// ─────────────────────────────────────────────────────────────
// SP Outreach Module
// ─────────────────────────────────────────────────────────────

// Service Provider: browse privacy-safe directory
export const fetchSPDirectory = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiRequest(`/api/sp-outreach/directory${qs ? `?${qs}` : ''}`);
};

// Service Provider: send a message to investor/builder
export const sendSPOutreachMessage = (payload) =>
  apiRequest('/api/sp-outreach/messages', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

// Service Provider: get own sent messages + statuses
export const fetchMySentOutreachMessages = () =>
  apiRequest('/api/sp-outreach/messages/my-sent');

// Service Provider: get replies on a specific message
export const fetchOutreachMessageReplies = (messageId) =>
  apiRequest(`/api/sp-outreach/messages/${messageId}/replies`);

// Admin: list all SP outreach messages
export const adminFetchSPOutreachMessages = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiRequest(`/api/sp-outreach/admin/messages${qs ? `?${qs}` : ''}`);
};

// Admin: accept or reject a message
export const adminReviewSPOutreachMessage = (messageId, action, adminNote = '') =>
  apiRequest(`/api/sp-outreach/admin/messages/${messageId}/review`, {
    method: 'PATCH',
    body: JSON.stringify({ action, adminNote }),
  });

// Admin: full thread detail
export const adminFetchOutreachThread = (messageId) =>
  apiRequest(`/api/sp-outreach/admin/messages/${messageId}`);

// Investor / Builder: get their SP message inbox
export const fetchOutreachInbox = () =>
  apiRequest('/api/sp-outreach/inbox');

// Investor / Builder: reply to a message
export const replyToSPOutreachMessage = (messageId, body) =>
  apiRequest(`/api/sp-outreach/messages/${messageId}/reply`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });

// Service Provider: reply inside thread
export const spReplyToOutreachMessage = (messageId, body) =>
  apiRequest(`/api/sp-outreach/messages/${messageId}/sp-reply`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });

// Admin: block or unblock conversation
export const adminBlockOutreachConversation = (messageId, block, reason) =>
  apiRequest(`/api/sp-outreach/admin/messages/${messageId}/block`, {
    method: 'PATCH',
    body: JSON.stringify({ block, reason }),
  });
