/**
 * TaskForm.jsx
 * ------------
 * Task creation/editing form component.
 * 
 * Allows admin to create new tasks or edit existing tasks.
 * Handles form validation and submission.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createTaskController, updateTaskController } from '../controllers/taskController';
import Input from '../components/Input';
import Button from '../components/Button';
import { formatDateForAPI } from '../utils/validation';
import './TaskForm.css';

/**
 * TaskForm Page Component
 */
const TaskForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  const isEditMode = !!id;
  const existingTask = location.state?.task;
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to_id: '',
    due_date: ''
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  
  // Loading state
  const [loading, setLoading] = useState(false);

  /**
   * Initialize form data if editing.
   */
  useEffect(() => {
    if (isEditMode && existingTask) {
      setFormData({
        title: existingTask.title || '',
        description: existingTask.description || '',
        assigned_to_id: existingTask.assigned_to_id ?? existingTask.assigned_user_id ?? '',
        due_date: existingTask.due_date
          ? new Date(existingTask.due_date).toISOString().slice(0, 16)
          : ''
      });
    }
  }, [isEditMode, existingTask]);

  /**
   * Redirect if not admin.
   */
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  /**
   * Handle input change.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'assigned_to_id' ? (parseInt(value, 10) || '') : value
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.assigned_to_id) {
      newErrors.assigned_to_id = 'Assigned user is required';
    } else if (isNaN(formData.assigned_to_id) || formData.assigned_to_id < 1) {
      newErrors.assigned_to_id = 'Valid user ID is required';
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
      const taskData = {
        title: formData.title,
        description: formData.description || null,
        assigned_to_id: parseInt(formData.assigned_to_id, 10),
        due_date: formData.due_date ? formatDateForAPI(formData.due_date) : null
      };
      
      if (isEditMode) {
        await updateTaskController(id, taskData);
      } else {
        await createTaskController(taskData);
      }
      
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        submit: error.message || 'Failed to save task'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <div className="task-form-card">
        <h1 className="task-form-title">
          {isEditMode ? 'Edit Task' : 'Create New Task'}
        </h1>
        
        <form onSubmit={handleSubmit} className="task-form">
          <Input
            label="Title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
            placeholder="Enter task title"
          />
          
          <div className="input-group">
            <label htmlFor="description" className="input-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              rows="4"
              placeholder="Enter task description (optional)"
            />
          </div>
          
          <Input
            label="Assigned User ID"
            type="number"
            name="assigned_to_id"
            value={formData.assigned_to_id}
            onChange={handleChange}
            error={errors.assigned_to_id}
            required
            placeholder="Enter employee user ID"
          />
          
          <Input
            label="Due Date"
            type="datetime-local"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            error={errors.due_date}
            placeholder="Select due date (optional)"
          />
          
          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}
          
          <div className="task-form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
