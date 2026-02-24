const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const apiRequest = async (endpoint, options = {}) => {
  // 1. Get the session from storage
  const session = JSON.parse(localStorage.getItem('user_session'));

  // 2. Setup headers
  const headers = {
    'Content-Type': 'application/json',
    // Attach the token if it exists (for protected routes)
    ...(session?.token && { 'Authorization': `Bearer ${session.token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    // 3. Handle 401 Unauthorized / Session Expiration
    if (response.status === 401) {
      // Is this request trying to log in or sync google?
      const isAuthRequest = endpoint.includes('/login') || 
                            endpoint.includes('/google-sync') || 
                            endpoint.includes('/admin-login');

      if (!isAuthRequest) {
        // If it's NOT an auth request, their session actually expired. Kick them out.
        localStorage.removeItem('user_session');
        window.location.href = '/';
        return Promise.reject('Session expired');
      } else {
        // If it IS an auth request, just throw the error so the Dialog can display it!
        throw new Error(data.message || 'Authentication failed');
      }
    }

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error.message);
    throw error;
  }
};

// Auth / Registration
export const loginRequest = (payload) =>
  apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export async function registerInvestor(payload) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function registerBuilder(payload) {
  const res = await fetch(`${API_BASE_URL}/api/auth/builder-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

// Investor Registration Step 1
export const createUserAuth = (authData) =>
  apiRequest('/api/auth/register-step1', {
    method: 'POST',
    body: JSON.stringify(authData),
  });

// Investor Registration Step 2
export const updateInvestorProfile = (uid, profileData) =>
  apiRequest(`/api/auth/register-step2/${uid}`, {
    method: 'POST',
    body: JSON.stringify(profileData),
  });

// Builder Registration Step 1
export const createBuilderAuth = (authData) =>
  apiRequest('/api/auth/builder-register-step1', {
    method: 'POST',
    body: JSON.stringify(authData),
  });

// Builder Registration Step 2
export const updateBuilderProfile = (uid, profileData) =>
  apiRequest(`/api/auth/builder-register-step2/${uid}`, {
    method: 'POST',
    body: JSON.stringify(profileData),
  });

export const adminLoginRequest = (payload) =>
  apiRequest('/api/auth/admin-login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const googleSyncRequest = async (idToken, role) => {
  // We send the ID Token and the requested role to the backend
  return apiRequest('/api/auth/google-sync', {
    method: 'POST',
    body: JSON.stringify({ idToken, role }), // Now includes the role
  });
};

export const fetchAllBuilders = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/builders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  // If the backend returns HTML instead of JSON (like a 404 page), this catches it
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

// Toggle Verification Status
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