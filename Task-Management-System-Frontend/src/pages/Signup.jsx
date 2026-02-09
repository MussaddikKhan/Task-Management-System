/**
 * Signup.jsx
 * ----------
 * User registration/signup page component.
 * 
 * Allows new users to create an account with email, password, and role.
 * Redirects to login page upon successful registration.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupController } from '../controllers/authController';
import { ROLES } from '../constants/roles';
import Input from '../components/Input';
import Button from '../components/Button';
import { isValidEmail, validatePassword } from '../utils/validation';
import './Signup.css';

/**
 * Signup Page Component
 */
const Signup = () => {
  const navigate = useNavigate();
  
  // Form state (no name - not in database)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ROLES.EMPLOYEE
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  
  // Loading state
  const [loading, setLoading] = useState(false);

  /**
   * Handle input change.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form data.
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await signupController(formData);
      // Redirect to login page on successful signup
      navigate('/login', { 
        state: { message: 'Account created successfully! Please login.' }
      });
    } catch (error) {
      setErrors({
        submit: error.message || 'Signup failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Create Account</h1>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="Enter your email"
          />
          
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            placeholder="Enter your password (min 6 characters)"
          />
          
          <div className="input-group">
            <label htmlFor="role" className="input-label">
              Role <span className="required">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input"
            >
              <option value={ROLES.EMPLOYEE}>Employee</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
            {errors.role && (
              <span className="input-error-message">{errors.role}</span>
            )}
          </div>
          
          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}
          
          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={loading}
            className="signup-button"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
        
        <p className="signup-footer">
          Already have an account?{' '}
          <Link to="/login" className="link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
