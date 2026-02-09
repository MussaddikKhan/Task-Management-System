import { getAllUsersQuery } from '../queries/userQueries';


export const getAllUsersDao = async (token) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const users = await getAllUsersQuery(token);
    return users;
  } catch (error) {
    throw error;
  }
};