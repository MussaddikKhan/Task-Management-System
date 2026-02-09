import {
  createTaskDao,
  getAllTasksDao,
  getMyTasksDao,
  updateTaskDao,
  deleteTaskDao,
  updateTaskStatusDao
} from '../dao/taskDao';
import { TASK_STATUS, isValidStatusTransition } from '../constants/taskStatus';

/**
 * Create a new task.
 * 
 * Business Logic:
 * - Validates required fields
 * - Validates assigned_to_id (employee ID)
 * - Calls DAO to create task
 * 
 * @param {Object} taskData - Task creation data
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} - Created task object
 * @throws {Error} - If validation fails or task creation fails
 */
export const createTaskService = async (taskData, token) => {
  try {
    // Validate required fields (backend expects assigned_to_id)
    if (!taskData.title || taskData.assigned_to_id == null || taskData.assigned_to_id === '') {
      throw new Error('Title and assigned user are required');
    }

    // Validate title length
    if (taskData.title.length < 3) {
      throw new Error('Title must be at least 3 characters long');
    }

    // Validate assigned_to_id is a number
    const assignedId = Number(taskData.assigned_to_id);
    if (Number.isNaN(assignedId) || assignedId < 1) {
      throw new Error('Assigned user ID must be a valid number');
    }

    // Call DAO to create task
    const task = await createTaskDao(taskData, token);
    return task;
  } catch (error) {
    const errorMessage = error.response?.data?.detail ?? error.message ?? 'Failed to create task';
    throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
  }
};

/**
 * Get all tasks (Admin only).
 * 
 * @param {string} token - JWT access token
 * @returns {Promise<Array>} - Array of task objects
 * @throws {Error} - If fetch fails
 */
export const getAllTasksService = async (token) => {
  try {
    const tasks = await getAllTasksDao(token);
    return tasks;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch tasks';
    throw new Error(errorMessage);
  }
};

/**
 * Get current user's assigned tasks (Employee only).
 * 
 * @param {string} token - JWT access token
 * @returns {Promise<Array>} - Array of task objects
 * @throws {Error} - If fetch fails
 */
export const getMyTasksService = async (token) => {
  try {
    const tasks = await getMyTasksDao(token);
    return tasks;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch tasks';
    throw new Error(errorMessage);
  }
};

/**
 * Update task details.
 * 
 * Business Logic:
 * - Validates at least one field is provided
 * - Validates taskId is a number
 * - Calls DAO to update task
 * 
 * @param {number} taskId - ID of task to update
 * @param {Object} updateData - Task update data
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} - Updated task object
 * @throws {Error} - If validation fails or update fails
 */
export const updateTaskService = async (taskId, updateData, token) => {
  try {
    const id = Number(taskId);
    if (Number.isNaN(id) || id < 1) {
      throw new Error('Valid task ID is required');
    }

    // Validate at least one field is provided
    const hasUpdateFields = Object.keys(updateData).length > 0;
    if (!hasUpdateFields) {
      throw new Error('At least one field must be provided for update');
    }

    const task = await updateTaskDao(id, updateData, token);
    return task;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to update task';
    throw new Error(errorMessage);
  }
};

/**
 * Delete a task.
 * 
 * Business Logic:
 * - Validates taskId is a number
 * - Calls DAO to delete task
 * 
 * @param {number} taskId - ID of task to delete
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} - Deletion confirmation
 * @throws {Error} - If validation fails or deletion fails
 */
export const deleteTaskService = async (taskId, token) => {
  try {
    const id = Number(taskId);
    if (Number.isNaN(id) || id < 1) {
      throw new Error('Valid task ID is required');
    }

    const result = await deleteTaskDao(id, token);
    return result;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to delete task';
    throw new Error(errorMessage);
  }
};

/**
 * Update task status.
 * 
 * Business Logic:
 * - Validates status is valid
 * - Validates status transition is allowed
 * - Calls DAO to update status
 * 
 * @param {number} taskId - ID of task to update
 * @param {string} currentStatus - Current task status
 * @param {Object} statusData - Status update data
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} - Updated task object
 * @throws {Error} - If validation fails or update fails
 */
export const updateTaskStatusService = async (taskId, currentStatus, statusData, token) => {
  try {
    const id = Number(taskId);
    if (Number.isNaN(id) || id < 1) {
      throw new Error('Valid task ID is required');
    }

    // Validate status is provided
    if (!statusData.status) {
      throw new Error('Status is required');
    }

    // Validate status is valid
    const validStatuses = Object.values(TASK_STATUS);
    if (!validStatuses.includes(statusData.status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Validate status transition is allowed
    if (currentStatus && !isValidStatusTransition(currentStatus, statusData.status)) {
      throw new Error(`Invalid status transition from "${currentStatus}" to "${statusData.status}"`);
    }

    // Map frontend lowercase status to backend enum format ("Pending", "In Progress", "Completed")
    // Backend expects body key "new_status" (Body(..., embed=True))
    const statusToBackend = { pending: 'Pending', 'in progress': 'In Progress', completed: 'Completed' };
    const payload = { new_status: statusToBackend[statusData.status] ?? statusData.status };

    const task = await updateTaskStatusDao(id, payload, token);
    return task;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to update task status';
    throw new Error(errorMessage);
  }
};
