import { signupDao, loginDao, getCurrentUserDao
 } from "../dao/authDao";
 import { ROLES } from "../constants/roles";

 export const signupService = async (userData) =>{
    try{
        if (!userData.email || !userData.password || !userData.role) {
            throw new Error('All fields are required');
        }
        // Validate email format (basic validation)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            throw new Error('Invalid email format');
        }

        // Validate password length
        if (userData.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        // Validate role
        if (userData.role !== ROLES.ADMIN && userData.role !== ROLES.EMPLOYEE) {
            throw new Error('Invalid role. Must be "admin" or "employee"');
        }

        // Call DAO to create user
        const user = await signupDao(userData);
        return user;
    } catch (error) {
        const detail = error.response?.data?.detail;
        const errorMessage = typeof detail === 'string'
            ? detail
            : Array.isArray(detail)
                ? detail.map((e) => e.msg || e).join(', ')
                : error.message || 'Signup failed';
        throw new Error(errorMessage);
    }
};

export const loginService = async (loginData) => {
  try {
    // Validate required fields
    if (!loginData.email || !loginData.password) {
      throw new Error('Email and password are required');
    }

    // Call DAO to authenticate user
    const response = await loginDao(loginData);
    
    // Validate response structure
    if (!response.access_token || !response.user) {
      throw new Error('Invalid login response');
    }

    return response;
  } catch (error) {
    // Extract error message from API response if available
    const errorMessage = error.response?.data?.detail || error.message || 'Login failed';
    throw new Error(errorMessage);
  }
};

export const getCurrentUserService = async (token) => {
  try {
    // Validate token exists
    if (!token) {
      throw new Error('Authentication token is required');
    }

    // Call DAO to fetch user
    const user = await getCurrentUserDao(token);
    return user;
  } catch (error) {
    // Extract error message from API response if available
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to get current user';
    throw new Error(errorMessage);
  }
};

