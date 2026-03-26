const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const apiRequest = async (endpoint, options = {}) => {
  const session = JSON.parse(localStorage.getItem('user_session'));

  const headers = {
    'Content-Type': 'application/json',
    ...(session?.token && { 'Authorization': `Bearer ${session.token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (response.status === 401) {
      const isAuthRequest = endpoint.includes('/login') || endpoint.includes('/google-sync') || endpoint.includes('/admin-login');
      if (!isAuthRequest) {
        localStorage.removeItem('user_session');
        window.location.href = '/';
        return Promise.reject('Session expired');
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    }

    if (!response.ok) {
      // --- THE FIX IS HERE ---
      // If the backend sent ANY custom error flag, return the whole object to the component
      if (data.error) {
        return Promise.reject(data);
      }

      // Otherwise, throw a standard text error
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
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

// Fetch all Investors
export const fetchAllInvestors = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/investors`, { // Adjust URL if your route path is different
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to fetch investors');
  }

  return response.json();
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

export const fetchAllBuilders = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/builders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new TypeError("Oops, we haven't got JSON! Check if the backend route is correct.");
  }

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to fetch builders');
  }

  return response.json();
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

export const fetchBuilderProjects = async (builderId) => {
  return apiRequest(`/api/projects?builderId=${builderId}`, { method: 'GET' });
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

// Fetch ALL projects (for Admin)
export const fetchAllProjects = async (token) => {
  // Since Admin needs to see all projects regardless of builderId, we call the base route
  return apiRequest('/api/projects', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
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