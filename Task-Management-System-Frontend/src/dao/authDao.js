/* eslint-disable no-useless-catch */
import { signupQuery,loginQuery,getCurrentUserQuery } from "../queries/authQueries";

export const signupDao = async (userData) => {
  try {
    const user = await signupQuery(userData);
    return user;
  } catch (error) {
    throw error;
  }
};

export const loginDao = async (loginData) => {
  try {
    const response = await loginQuery(loginData);
    return response;
  } catch (error) {
    throw error;
  }
};


export const getCurrentUserDao = async (token) => {
  try {
    const user = await getCurrentUserQuery(token);
    return user;
  } catch (error) {
    throw error;
  }
};
