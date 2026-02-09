/* eslint-disable no-useless-catch */
/**
 * userController.js
 * -----------------
 * User Controller.
 *
 * Handles user-related operations for the frontend.
 * Controllers call service layer functions and handle
 * authentication token retrieval and basic errors.
 */

import { getAllUsersService } from '../services/userService';
import { getToken } from '../utils/auth';

/**
 * Fetch all users (Admin only).
 *
 * @returns {Promise<Array>} - Array of user objects
 * @throws {Error} - If fetch fails or user is not authenticated
 */
export const getAllUsersController = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const users = await getAllUsersService(token);
    return users;
  } catch (error) {
    throw error;
  }
};

