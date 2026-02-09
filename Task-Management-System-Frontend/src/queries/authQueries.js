import { AUTH_ENDPOINTS } from '../constants/apiEndpoints';

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(Array.isArray(data.detail) ? data.detail.map((e) => e.msg || e).join(', ') : data.detail || data.message || res.statusText);
    err.response = { status: res.status, data };
    throw err;
  }
  return data;
}

export const signupQuery = async (userData) => {
  return request(AUTH_ENDPOINTS.SIGNUP, { method: 'POST', body: JSON.stringify(userData) });
};

export const loginQuery = async (loginData) => {
  return request(AUTH_ENDPOINTS.LOGIN, { method: 'POST', body: JSON.stringify(loginData) });
};

export const getCurrentUserQuery = async (token) => {
  return request(AUTH_ENDPOINTS.GET_CURRENT_USER, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
};