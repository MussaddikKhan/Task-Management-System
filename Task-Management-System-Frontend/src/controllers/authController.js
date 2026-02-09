/* eslint-disable no-useless-catch */
/**
 * authController.js
 * -----------------
 * Authentication Controller.
 * 
 * This file contains controller functions that handle authentication
 * operations. Controllers call service layer functions and handle
 * the results, including error handling and state updates.
 * 
 * In React, controllers are typically used within components or
 * custom hooks to handle user interactions and API calls.
 * 
 * Responsibilities:
 * - Handle user signup
 * - Handle user login
 * - Handle logout
 * - Call service layer functions
 * - Handle errors and return results
 */

import { signupService, loginService, getCurrentUserService } from '../services/authService';
import { saveToken, saveUser, clearAuth, getToken } from '../utils/auth';

/**
 * Handle user signup.
 * 
 * This function:
 * 1. Calls signup service
 * 2. Saves user data to localStorage
 * 3. Returns user object
 * 
 * @param {Object} userData - User signup data
 * @returns {Promise<Object>} - User object
 * @throws {Error} - If signup fails
 */
export const signupController = async (userData) => {
  try {
    // Call service layer
    const user = await signupService(userData);
    
    // Note: Signup doesn't return a token, user needs to login
    // But we can save user data if needed
    saveUser(user);
    
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Handle user login.
 * 
 * This function:
 * 1. Calls login service
 * 2. Saves token and user data to localStorage
 * 3. Returns login response
 * 
 * @param {Object} loginData - Login credentials
 * @returns {Promise<Object>} - Login response with token and user
 * @throws {Error} - If login fails
 */
export const loginController = async (loginData) => {
  try {
    // Call service layer
    const response = await loginService(loginData);
    
    // Save token and user to localStorage
    saveToken(response.access_token);
    saveUser(response.user);
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Handle user logout.
 * 
 * This function:
 * 1. Clears authentication data from localStorage
 * 2. Returns success
 * 
 * @returns {void}
 */
export const logoutController = () => {
  try {
    clearAuth();
  } catch (error) {
    console.error('Logout error:', error);
  }
};

  /**
   * Get current authenticated user.
   * 
   * This function:
   * 1. Gets token from localStorage
   * 2. Calls service to fetch user data
   * 3. Updates user data in localStorage
   * 4. Returns user object
   * 
   * @param {string} token - JWT access token (optional, will get from storage if not provided)
   * @returns {Promise<Object>} - User object
   * @throws {Error} - If token is invalid or user not found
   */
export const getCurrentUserController = async (token = null) => {
  try {
    // Get token from storage if not provided
    const authToken = token || getToken();
    
    if (!authToken) {
      throw new Error('No authentication token found');
    }
    
    // Call service layer
    const user = await getCurrentUserService(authToken);
    
    // Update user data in localStorage
    saveUser(user);
    
    return user;
  } catch (error) {
    // Clear auth data if token is invalid
    clearAuth();
    throw error;
  }
};
