/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
/**
 * userService.js
 * ---------------
 * User service layer. Fetches users (e.g. all users for admin).
 */

import { getAllUsersDao } from '../dao/userDao';

/**
 * Fetch all users (Admin only).
 *
 * @param {string} token - Auth token
 * @returns {Promise<Array>} - Array of user objects
 */
export const getAllUsersService = async (token) => {
  try {
    const users = await getAllUsersDao(token);
    return users;
  } catch (error) {
    throw error;
  }
};
