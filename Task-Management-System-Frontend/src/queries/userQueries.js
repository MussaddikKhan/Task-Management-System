import { USER_ENDPOINTS } from '../constants/apiEndpoints';

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.detail || data.message || res.statusText);
    err.response = { status: res.status, data };
    throw err;
  }
  return data;
}

export const getAllUsersQuery = async (token) => {
  return request(USER_ENDPOINTS.GET_ALL_USERS, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
};