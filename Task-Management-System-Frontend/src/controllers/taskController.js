/* eslint-disable no-useless-catch */
/**
 * taskController.js
 * ------------------
 * Task Controller.
 * 
 * This file contains controller functions that handle task
 * operations. Controllers call service layer functions and handle
 * the results, including error handling.
 * 
 * In React, controllers are typically used within components or
 * custom hooks to handle user interactions and API calls.
 * 
 * Responsibilities:
 * - Handle task creation
 * - Handle task fetching
 * - Handle task updates
 * - Handle task deletion
 * - Handle status updates
 * - Call service layer functions
 * - Handle errors and return results
 */

import {
  createTaskService,
  getAllTasksService,
  getMyTasksService,
  updateTaskService,
  deleteTaskService,
  updateTaskStatusService
} from '../services/taskServices';
import { getToken } from '../utils/auth';

/**
 * Handle task creation.
 * 
 * @param {Object} taskData - Task creation data
 * @returns {Promise<Object>} - Created task object
 * @throws {Error} - If creation fails
 */
export const createTaskController = async (taskData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const task = await createTaskService(taskData, token);
    return task;
  } catch (error) {
    throw error;
  }
};

/**
 * Handle fetching all tasks (Admin only).
 * 
 * @returns {Promise<Array>} - Array of task objects
 * @throws {Error} - If fetch fails
 */
export const getAllTasksController = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const tasks = await getAllTasksService(token);
    return tasks;
  } catch (error) {
    throw error;
  }
};

/**
 * Handle fetching current user's tasks (Employee only).
 * 
 * @returns {Promise<Array>} - Array of task objects
 * @throws {Error} - If fetch fails
 */
export const getMyTasksController = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const tasks = await getMyTasksService(token);
    return tasks;
  } catch (error) {
    throw error;
  }
};

/**
 * Handle task update.
 * 
 * @param {number} taskId - ID of task to update
 * @param {Object} updateData - Task update data
 * @returns {Promise<Object>} - Updated task object
 * @throws {Error} - If update fails
 */
export const updateTaskController = async (taskId, updateData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const task = await updateTaskService(taskId, updateData, token);
    return task;
  } catch (error) {
    throw error;
  }
};

/**
 * Handle task deletion.
 * 
 * @param {number} taskId - ID of task to delete
 * @returns {Promise<Object>} - Deletion confirmation
 * @throws {Error} - If deletion fails
 */
export const deleteTaskController = async (taskId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const result = await deleteTaskService(taskId, token);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Handle task status update.
 * 
 * @param {number} taskId - ID of task to update
 * @param {string} currentStatus - Current task status
 * @param {Object} statusData - Status update data
 * @returns {Promise<Object>} - Updated task object
 * @throws {Error} - If update fails
 */
export const updateTaskStatusController = async (taskId, currentStatus, statusData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const task = await updateTaskStatusService(taskId, currentStatus, statusData, token);
    return task;
  } catch (error) {
    throw error;
  }
};
