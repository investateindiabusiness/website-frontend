const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

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

    // Handle session expiration (if token is invalid)
    if (response.status === 401) {
      localStorage.removeItem('user_session');
      window.location.href = '/login'; 
      return Promise.reject('Session expired');
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