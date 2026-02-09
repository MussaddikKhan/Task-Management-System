/* eslint-disable no-useless-catch */


import {
  createTaskQuery,
  getAllTasksQuery,
  getMyTasksQuery,
  updateTaskQuery,
  deleteTaskQuery,
  updateTaskStatusQuery
} from '../queries/taskQueries';

export const createTaskDao = async (taskData, token) => {
  try {
    const task = await createTaskQuery(taskData, token);
    return task;
  } catch (error) {
    throw error;
  }
};


export const getAllTasksDao = async (token) => {
  try {
    const tasks = await getAllTasksQuery(token);
    return tasks;
  } catch (error) {
    throw error;
  }
};


export const getMyTasksDao = async (token) => {
  try {
    const tasks = await getMyTasksQuery(token);
    return tasks;
  } catch (error) {
    throw error;
  }
};


export const updateTaskDao = async (taskId, updateData, token) => {
  try {
    const task = await updateTaskQuery(taskId, updateData, token);
    return task;
  } catch (error) {
    throw error;
  }
};


export const deleteTaskDao = async (taskId, token) => {
  try {
    const result = await deleteTaskQuery(taskId, token);
    return result;
  } catch (error) {
    throw error;
  }
};


export const updateTaskStatusDao = async (taskId, statusData, token) => {
  try {
    const task = await updateTaskStatusQuery(taskId, statusData, token);
    return task;
  } catch (error) {
    throw error;
  }
};
