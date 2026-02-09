const BASE_URL = 'http://localhost:8000';

export const AUTH_ENDPOINTS = {
    SIGNUP: `${BASE_URL}/auth/signup`,
    LOGIN: `${BASE_URL}/auth/login`,
    GET_CURRENT_USER: `${BASE_URL}/auth/me`
};

export const USER_ENDPOINTS = {
    GET_ALL_USERS: `${BASE_URL}/user/`
};

export const TASK_ENDPOINTS = {
    CREATE: `${BASE_URL}/tasks/`,
    GET_ALL: `${BASE_URL}/tasks/`,
    GET_MY_TASKS: `${BASE_URL}/tasks/my-tasks`,
    UPDATE: (taskId) => `${BASE_URL}/tasks/${taskId}`,
    DELETE: (taskId) => `${BASE_URL}/tasks/${taskId}`,
    UPDATE_STATUS: (taskId) => `${BASE_URL}/tasks/${taskId}/status`,
};
