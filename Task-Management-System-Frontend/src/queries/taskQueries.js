import { TASK_ENDPOINTS } from '../constants/apiEndpoints';

const NETWORK_ERROR_MSG = 'Cannot reach server. Make sure the backend is running at http://localhost:8000';

async function request(url, options = {}) {
  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch (networkError) {
    const msg = networkError?.message === 'Failed to fetch' ? NETWORK_ERROR_MSG : (networkError?.message || NETWORK_ERROR_MSG);
    throw new Error(msg);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(Array.isArray(data.detail) ? data.detail.map((e) => e.msg || e).join(', ') : data.detail || data.message || res.statusText);
    err.response = { status: res.status, data };
    throw err;
  }
  return data;
}

const auth = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const createTaskQuery = async (taskData, token) => {
  return request(TASK_ENDPOINTS.CREATE, { method: 'POST', body: JSON.stringify(taskData), ...auth(token) });
};

export const getAllTasksQuery = async (token) => {
  return request(TASK_ENDPOINTS.GET_ALL, { method: 'GET', ...auth(token) });
};

export const getMyTasksQuery = async (token) => {
  return request(TASK_ENDPOINTS.GET_MY_TASKS, { method: 'GET', ...auth(token) });
};

export const updateTaskQuery = async (taskId, updateData, token) => {
  return request(TASK_ENDPOINTS.UPDATE(taskId), { method: 'PATCH', body: JSON.stringify(updateData), ...auth(token) });
};

export const deleteTaskQuery = async (taskId, token) => {
  return request(TASK_ENDPOINTS.DELETE(taskId), { method: 'DELETE', ...auth(token) });
};

export const updateTaskStatusQuery = async (taskId, statusData, token) => {
  return request(TASK_ENDPOINTS.UPDATE_STATUS(taskId), { method: 'PATCH', body: JSON.stringify(statusData), ...auth(token) });
};