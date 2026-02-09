/* eslint-disable no-useless-catch */
/**
 * AuthContext.jsx
 * ---------------
 * Authentication Context for global state management.
 * 
 * This context provides authentication state and functions
 * to all components in the application. It manages:
 * - Current user data
 * - Authentication status
 * - Login/logout functions
 * 
 * Usage:
 *   const { user, isAuthenticated, login, logout } = useAuth();
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginController, logoutController, getCurrentUserController } from '../controllers/authController';
import { getToken, getUser } from '../utils/auth';

// Create Auth Context
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * 
 * Provides authentication context to all child components.
 * Manages authentication state and provides login/logout functions.
 */
export const AuthProvider = ({ children }) => {
  // State for current user
  const [user, setUser] = useState(null);
  
  // State for loading status
  const [loading, setLoading] = useState(true);

  /**
   * Initialize authentication state on mount.
   * Checks if user is already logged in.
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getToken();
        const savedUser = getUser();
        
        if (token && savedUser) {
          // Verify token is still valid by fetching current user
          try {
            const currentUser = await getCurrentUserController(token);
            setUser(currentUser);
          } catch (error) {
            // Token is invalid, clear auth data
            console.log(error)
            logoutController();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login function.
   * 
   * @param {Object} loginData - Login credentials (email, password)
   * @returns {Promise<void>}
   * @throws {Error} - If login fails
   */
  const login = async (loginData) => {
    try {
      const response = await loginController(loginData);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logout function.
   * Clears authentication data and resets user state.
   */
  const logout = () => {
    logoutController();
    setUser(null);
  };

  /**
   * Check if user is authenticated.
   * 
   * @returns {boolean} - True if user is authenticated
   */
  const isAuthenticated = () => {
    return !!user;
  };

  /**
   * Check if current user is admin (case-insensitive to match backend ADMIN/MANAGER).
   * 
   * @returns {boolean} - True if user is admin
   */
  const isAdmin = () => {
    const role = user?.role?.toLowerCase();
    return role === 'admin' || role === 'manager';
  };

  /**
   * Check if current user is employee (case-insensitive to match backend EMPLOYEE).
   * 
   * @returns {boolean} - True if user is employee
   */
  const isEmployee = () => {
    return user?.role?.toLowerCase() === 'employee';
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    isEmployee: isEmployee()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 * 
 * Custom hook to access authentication context.
 * 
 * @returns {Object} - Auth context value
 * @throws {Error} - If used outside AuthProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
