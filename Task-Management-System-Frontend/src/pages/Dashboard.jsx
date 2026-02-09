/**
 * Dashboard.jsx
 * ------------
 * Dashboard page component.
 * 
 * Displays different views based on user role:
 * - Admin: Shows all tasks with create/edit/delete options, or their assigned tasks
 * - Employee: Shows only assigned tasks with status update options
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getAllTasksController, 
  getMyTasksController,
  deleteTaskController,
  updateTaskStatusController
} from '../controllers/taskController';
import { getAllUsersController } from '../controllers/userController';
import TaskCard from '../components/TaskCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { ROLES } from '../constants/roles';
import { TASK_STATUS } from '../constants/taskStatus';
import './Dashboard.css';

/**
 * Dashboard Page Component
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin, isEmployee } = useAuth();
  
  // View state
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'employees'
  const [taskViewMode, setTaskViewMode] = useState('all'); // 'all' | 'my' (for admin)

  // Tasks state
  const [tasks, setTasks] = useState([]);

  // Employees state (admin)
  const [employees, setEmployees] = useState([]);

  // Task filters
  const [taskSearch, setTaskSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'in progress' | 'completed'
  const TASKS_PER_SECTION = 10; // Limit tasks per section

  // Employees filters & pagination
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [employeePage, setEmployeePage] = useState(1);
  const EMPLOYEES_PER_PAGE = 5;
  
  // Loading state
  const [loading, setLoading] = useState(true);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);
  const [employeesError, setEmployeesError] = useState(null);

  /**
   * Fetch tasks based on user role and view mode.
   */
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let fetchedTasks;
      if (isAdmin) {
        if (taskViewMode === 'my') {
          // Admin viewing their assigned tasks
          fetchedTasks = await getMyTasksController();
        } else {
          // Admin viewing all tasks
          fetchedTasks = await getAllTasksController();
        }
      } else if (isEmployee) {
        fetchedTasks = await getMyTasksController();
      } else {
        throw new Error('Invalid user role');
      }
      
      // Normalize status to lowercase so grouping/filters match (API may return "Pending", "In Progress", "Completed")
      setTasks(
        Array.isArray(fetchedTasks)
          ? fetchedTasks.map((t) => ({
              ...t,
              status: (t.status || '').toLowerCase(),
            }))
          : []
      );
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all employees (admin only).
   */
  const fetchEmployees = async () => {
    if (!isAdmin) return;

    try {
      setEmployeesLoading(true);
      setEmployeesError(null);

      const fetchedUsers = await getAllUsersController();

      // Optional: sort by created date (newest first)
      const sorted = [...fetchedUsers].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setEmployees(sorted);
      setEmployeePage(1);
    } catch (err) {
      setEmployeesError(err.message || 'Failed to fetch employees');
    } finally {
      setEmployeesLoading(false);
    }
  };

  /**
   * Fetch tasks on component mount and when view mode changes.
   */
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, taskViewMode]);

  /**
   * If admin switches to Employees tab for the first time, fetch employees.
   */
  useEffect(() => {
    if (activeTab === 'employees' && isAdmin && employees.length === 0 && !employeesLoading) {
      fetchEmployees();
    }
  }, [activeTab, isAdmin]);

  /**
   * Handle task deletion (Admin only).
   */
  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await deleteTaskController(taskId);
      // Refresh tasks list
      await fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to delete task');
    }
  };

  /**
   * Handle task status update (Employee or Admin for their assigned tasks).
   */
  const handleStatusChange = async (taskId, currentStatus, newStatus) => {
    try {
      await updateTaskStatusController(taskId, currentStatus, { status: newStatus });
      // Refresh tasks list
      await fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to update task status');
    }
  };

  /**
   * Handle edit task (Admin only).
   */
  const handleEdit = (task) => {
    navigate(`/tasks/${task.id}/edit`, { state: { task } });
  };

  /**
   * Handle logout.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Filter and group tasks by status.
   */
  const filteredAndGroupedTasks = useMemo(() => {
    const term = taskSearch.toLowerCase().trim();
    
    // Filter tasks by search term
    let filtered = tasks.filter((task) => {
      const matchesSearch =
        !term ||
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term)) ||
        String(task.id).includes(term);

      const statusNorm = (task.status || '').toLowerCase();
      const matchesStatus =
        statusFilter === 'all' ? true : statusNorm === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Group by status (normalize so API "Pending"/"In Progress"/"Completed" matches frontend lowercase)
    const grouped = {
      pending: filtered.filter(t => (t.status || '').toLowerCase() === TASK_STATUS.PENDING),
      'in progress': filtered.filter(t => (t.status || '').toLowerCase() === TASK_STATUS.IN_PROGRESS),
      completed: filtered.filter(t => (t.status || '').toLowerCase() === TASK_STATUS.COMPLETED)
    };

    return grouped;
  }, [tasks, taskSearch, statusFilter]);

  /**
   * State for showing more tasks in each section
   */
  const [expandedSections, setExpandedSections] = useState({
    pending: false,
    'in progress': false,
    completed: false
  });

  /**
   * Get displayed tasks for a section (with pagination)
   */
  const getDisplayedTasks = (sectionTasks, sectionKey) => {
    if (sectionTasks.length <= TASKS_PER_SECTION) {
      return sectionTasks;
    }
    if (expandedSections[sectionKey]) {
      return sectionTasks;
    }
    return sectionTasks.slice(0, TASKS_PER_SECTION);
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  /**
   * Calculate task statistics for the current view.
   * Statistics are based on unfiltered tasks to show true counts.
   */
  const taskStatistics = useMemo(() => {
    const total = tasks.length;
    const norm = (s) => (s || '').toLowerCase();
    const pending = tasks.filter(t => norm(t.status) === TASK_STATUS.PENDING).length;
    const inProgress = tasks.filter(t => norm(t.status) === TASK_STATUS.IN_PROGRESS).length;
    const completed = tasks.filter(t => norm(t.status) === TASK_STATUS.COMPLETED).length;

    return {
      total,
      pending,
      inProgress,
      completed
    };
  }, [tasks]);


  /**
   * Derived employees list with search, filter, and pagination.
   */
  const filteredEmployees = useMemo(() => {
    const term = employeeSearch.toLowerCase().trim();

    return employees.filter((emp) => {
      const matchesSearch =
        !term ||
        (emp.name && emp.name.toLowerCase().includes(term)) ||
        (emp.email && emp.email.toLowerCase().includes(term)) ||
        String(emp.id).includes(term);

      const matchesRole =
        roleFilter === 'all' ? true : emp.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [employees, employeeSearch, roleFilter]);

  const totalEmployeePages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE)
  );

  const paginatedEmployees = useMemo(() => {
    const startIndex = (employeePage - 1) * EMPLOYEES_PER_PAGE;
    return filteredEmployees.slice(
      startIndex,
      startIndex + EMPLOYEES_PER_PAGE
    );
  }, [filteredEmployees, employeePage]);

  const handleChangeEmployeePage = (newPage) => {
    if (newPage < 1 || newPage > totalEmployeePages) return;
    setEmployeePage(newPage);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Task Management Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome, {user?.name || user?.email} ({user?.role})
          </p>
        </div>
        <div className="dashboard-actions">
          {isAdmin && (
            <Button
              variant="primary"
              onClick={() => navigate('/tasks/create')}
            >
              Create Task
            </Button>
          )}
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {isAdmin && (
        <div className="dashboard-tabs">
          <button
            className={`dashboard-tab-button ${
              activeTab === 'tasks' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button
            className={`dashboard-tab-button ${
              activeTab === 'employees' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('employees')}
          >
            Employees
          </button>
        </div>
      )}

      {activeTab === 'tasks' && error && (
        <div className="error-banner">
          {error}
          <Button 
            variant="secondary" 
            size="small"
            onClick={fetchTasks}
          >
            Retry
          </Button>
        </div>
      )}

      {activeTab === 'employees' && employeesError && (
        <div className="error-banner">
          {employeesError}
          <Button 
            variant="secondary" 
            size="small"
            onClick={fetchEmployees}
          >
            Retry
          </Button>
        </div>
      )}

      <main className="dashboard-content">
        {activeTab === 'tasks' && (
          <>
            {/* Task View Mode Toggle (Admin only) */}
            {isAdmin && (
              <div className="task-view-toggle">
                <button
                  className={`view-mode-button ${taskViewMode === 'all' ? 'active' : ''}`}
                  onClick={() => {
                    setTaskViewMode('all');
                  }}
                >
                  All Tasks
                </button>
                <button
                  className={`view-mode-button ${taskViewMode === 'my' ? 'active' : ''}`}
                  onClick={() => {
                    setTaskViewMode('my');
                  }}
                >
                  My Assigned Tasks
                </button>
              </div>
            )}

            {/* Task Summary Statistics */}
            {!loading && (
              <div className="task-summary">
                <div className="summary-card summary-total">
                  <div className="summary-icon">📊</div>
                  <div className="summary-content">
                    <div className="summary-label">Total Tasks</div>
                    <div className="summary-value">{taskStatistics.total}</div>
                  </div>
                </div>
                <div className="summary-card summary-pending">
                  <div className="summary-icon">⏳</div>
                  <div className="summary-content">
                    <div className="summary-label">Pending</div>
                    <div className="summary-value">{taskStatistics.pending}</div>
                  </div>
                </div>
                <div className="summary-card summary-in-progress">
                  <div className="summary-icon">🔄</div>
                  <div className="summary-content">
                    <div className="summary-label">In Progress</div>
                    <div className="summary-value">{taskStatistics.inProgress}</div>
                  </div>
                </div>
                <div className="summary-card summary-completed">
                  <div className="summary-icon">✅</div>
                  <div className="summary-content">
                    <div className="summary-label">Completed</div>
                    <div className="summary-value">{taskStatistics.completed}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Task Search and Filters */}
            <div className="tasks-toolbar">
              <div className="tasks-search">
                <input
                  type="text"
                  placeholder="Search tasks by title, description, or ID..."
                  value={taskSearch}
                  onChange={(e) => {
                    setTaskSearch(e.target.value);
                  }}
                />
              </div>
              <div className="tasks-filters">
                <label>
                  Status:
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                    }}
                  >
                    <option value="all">All Statuses</option>
                    <option value={TASK_STATUS.PENDING}>Pending</option>
                    <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                    <option value={TASK_STATUS.COMPLETED}>Completed</option>
                  </select>
                </label>
              </div>
            </div>

            {loading ? (
              <div className="dashboard-loading-section">
                <LoadingSpinner message="Loading tasks..." />
              </div>
            ) : Object.values(filteredAndGroupedTasks).every(arr => arr.length === 0) ? (
              <div className="empty-state">
                <p>No tasks found.</p>
                {isAdmin && (
                  <Button
                    variant="primary"
                    onClick={() => navigate('/tasks/create')}
                  >
                    Create Your First Task
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Tasks grouped by status */}
                <div className="tasks-sections">
                  {/* Render sections based on filter */}
                  {statusFilter === 'all' ? (
                    <>
                      {/* Pending Section */}
                      <div className="task-section">
                        <h2 className="task-section-title">
                          Pending ({filteredAndGroupedTasks.pending.length})
                        </h2>
                        {filteredAndGroupedTasks.pending.length === 0 ? (
                          <div className="task-section-empty">
                            <p>No pending tasks</p>
                          </div>
                        ) : (
                          <>
                            <div className="tasks-grid">
                              {getDisplayedTasks(filteredAndGroupedTasks.pending, 'pending').map(task => (
                                <TaskCard
                                  key={task.id}
                                  task={task}
                                  isAdmin={isAdmin}
                                  onEdit={handleEdit}
                                  onDelete={handleDelete}
                                  onStatusChange={handleStatusChange}
                                  canUpdateStatus={taskViewMode === 'my' || !isAdmin}
                                />
                              ))}
                            </div>
                            {filteredAndGroupedTasks.pending.length > TASKS_PER_SECTION && (
                              <div className="task-section-more">
                                <button
                                  className="show-more-button"
                                  onClick={() => toggleSection('pending')}
                                >
                                  {expandedSections.pending
                                    ? `Show Less (${filteredAndGroupedTasks.pending.length - TASKS_PER_SECTION} hidden)`
                                    : `Show More (${filteredAndGroupedTasks.pending.length - TASKS_PER_SECTION} more)`}
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* In Progress Section */}
                      <div className="task-section">
                        <h2 className="task-section-title">
                          In Progress ({filteredAndGroupedTasks['in progress'].length})
                        </h2>
                        {filteredAndGroupedTasks['in progress'].length === 0 ? (
                          <div className="task-section-empty">
                            <p>No in-progress tasks</p>
                          </div>
                        ) : (
                          <>
                            <div className="tasks-grid">
                              {getDisplayedTasks(filteredAndGroupedTasks['in progress'], 'in progress').map(task => (
                                <TaskCard
                                  key={task.id}
                                  task={task}
                                  isAdmin={isAdmin}
                                  onEdit={handleEdit}
                                  onDelete={handleDelete}
                                  onStatusChange={handleStatusChange}
                                  canUpdateStatus={taskViewMode === 'my' || !isAdmin}
                                />
                              ))}
                            </div>
                            {filteredAndGroupedTasks['in progress'].length > TASKS_PER_SECTION && (
                              <div className="task-section-more">
                                <button
                                  className="show-more-button"
                                  onClick={() => toggleSection('in progress')}
                                >
                                  {expandedSections['in progress']
                                    ? `Show Less (${filteredAndGroupedTasks['in progress'].length - TASKS_PER_SECTION} hidden)`
                                    : `Show More (${filteredAndGroupedTasks['in progress'].length - TASKS_PER_SECTION} more)`}
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Completed Section */}
                      <div className="task-section">
                        <h2 className="task-section-title">
                          Completed ({filteredAndGroupedTasks.completed.length})
                        </h2>
                        {filteredAndGroupedTasks.completed.length === 0 ? (
                          <div className="task-section-empty">
                            <p>No completed tasks</p>
                          </div>
                        ) : (
                          <>
                            <div className="tasks-grid">
                              {getDisplayedTasks(filteredAndGroupedTasks.completed, 'completed').map(task => (
                                <TaskCard
                                  key={task.id}
                                  task={task}
                                  isAdmin={isAdmin}
                                  onEdit={handleEdit}
                                  onDelete={handleDelete}
                                  onStatusChange={handleStatusChange}
                                  canUpdateStatus={taskViewMode === 'my' || !isAdmin}
                                />
                              ))}
                            </div>
                            {filteredAndGroupedTasks.completed.length > TASKS_PER_SECTION && (
                              <div className="task-section-more">
                                <button
                                  className="show-more-button"
                                  onClick={() => toggleSection('completed')}
                                >
                                  {expandedSections.completed
                                    ? `Show Less (${filteredAndGroupedTasks.completed.length - TASKS_PER_SECTION} hidden)`
                                    : `Show More (${filteredAndGroupedTasks.completed.length - TASKS_PER_SECTION} more)`}
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Show only the filtered section */}
                      {statusFilter === TASK_STATUS.PENDING && (
                        <div className="task-section">
                          <h2 className="task-section-title">
                            Pending ({filteredAndGroupedTasks.pending.length})
                          </h2>
                          {filteredAndGroupedTasks.pending.length === 0 ? (
                            <div className="task-section-empty">
                              <p>No pending tasks</p>
                            </div>
                          ) : (
                            <>
                              <div className="tasks-grid">
                                {getDisplayedTasks(filteredAndGroupedTasks.pending, 'pending').map(task => (
                                  <TaskCard
                                    key={task.id}
                                    task={task}
                                    isAdmin={isAdmin}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onStatusChange={handleStatusChange}
                                    canUpdateStatus={taskViewMode === 'my' || !isAdmin}
                                  />
                                ))}
                              </div>
                              {filteredAndGroupedTasks.pending.length > TASKS_PER_SECTION && (
                                <div className="task-section-more">
                                  <button
                                    className="show-more-button"
                                    onClick={() => toggleSection('pending')}
                                  >
                                    {expandedSections.pending
                                      ? `Show Less (${filteredAndGroupedTasks.pending.length - TASKS_PER_SECTION} hidden)`
                                      : `Show More (${filteredAndGroupedTasks.pending.length - TASKS_PER_SECTION} more)`}
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}

                      {statusFilter === TASK_STATUS.IN_PROGRESS && (
                        <div className="task-section">
                          <h2 className="task-section-title">
                            In Progress ({filteredAndGroupedTasks['in progress'].length})
                          </h2>
                          {filteredAndGroupedTasks['in progress'].length === 0 ? (
                            <div className="task-section-empty">
                              <p>No in-progress tasks</p>
                            </div>
                          ) : (
                            <>
                              <div className="tasks-grid">
                                {getDisplayedTasks(filteredAndGroupedTasks['in progress'], 'in progress').map(task => (
                                  <TaskCard
                                    key={task.id}
                                    task={task}
                                    isAdmin={isAdmin}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onStatusChange={handleStatusChange}
                                    canUpdateStatus={taskViewMode === 'my' || !isAdmin}
                                  />
                                ))}
                              </div>
                              {filteredAndGroupedTasks['in progress'].length > TASKS_PER_SECTION && (
                                <div className="task-section-more">
                                  <button
                                    className="show-more-button"
                                    onClick={() => toggleSection('in progress')}
                                  >
                                    {expandedSections['in progress']
                                      ? `Show Less (${filteredAndGroupedTasks['in progress'].length - TASKS_PER_SECTION} hidden)`
                                      : `Show More (${filteredAndGroupedTasks['in progress'].length - TASKS_PER_SECTION} more)`}
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}

                      {statusFilter === TASK_STATUS.COMPLETED && (
                        <div className="task-section">
                          <h2 className="task-section-title">
                            Completed ({filteredAndGroupedTasks.completed.length})
                          </h2>
                          {filteredAndGroupedTasks.completed.length === 0 ? (
                            <div className="task-section-empty">
                              <p>No completed tasks</p>
                            </div>
                          ) : (
                            <>
                              <div className="tasks-grid">
                                {getDisplayedTasks(filteredAndGroupedTasks.completed, 'completed').map(task => (
                                  <TaskCard
                                    key={task.id}
                                    task={task}
                                    isAdmin={isAdmin}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onStatusChange={handleStatusChange}
                                    canUpdateStatus={taskViewMode === 'my' || !isAdmin}
                                  />
                                ))}
                              </div>
                              {filteredAndGroupedTasks.completed.length > TASKS_PER_SECTION && (
                                <div className="task-section-more">
                                  <button
                                    className="show-more-button"
                                    onClick={() => toggleSection('completed')}
                                  >
                                    {expandedSections.completed
                                      ? `Show Less (${filteredAndGroupedTasks.completed.length - TASKS_PER_SECTION} hidden)`
                                      : `Show More (${filteredAndGroupedTasks.completed.length - TASKS_PER_SECTION} more)`}
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'employees' && isAdmin && (
          <section className="employees-section">
            <div className="employees-toolbar">
              <div className="employees-search">
                <input
                  type="text"
                  placeholder="Search by email or employee ID..."
                  value={employeeSearch}
                  onChange={(e) => {
                    setEmployeeSearch(e.target.value);
                    setEmployeePage(1);
                  }}
                />
              </div>
              <div className="employees-filters">
                <label>
                  Role:
                  <select
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value);
                      setEmployeePage(1);
                    }}
                  >
                    <option value="all">All Roles</option>
                    <option value={ROLES.ADMIN}>Admin</option>
                    <option value={ROLES.EMPLOYEE}>Employee</option>
                  </select>
                </label>
              </div>
            </div>

            {employeesLoading ? (
              <div className="dashboard-loading-section">
                <LoadingSpinner message="Loading employees..." />
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="empty-state">
                <p>No employees found.</p>
              </div>
            ) : (
              <>
                <div className="employees-table-wrapper">
                  <table className="employees-table">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedEmployees.map((emp) => (
                        <tr key={emp.id}>
                          <td className="employee-id-cell">#{emp.id}</td>
                          <td>{emp.email}</td>
                          <td className={`role-badge role-${emp.role}`}>
                            {emp.role}
                          </td>
                          <td>
                            {new Date(emp.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="employees-pagination">
                  <button
                    onClick={() => handleChangeEmployeePage(employeePage - 1)}
                    disabled={employeePage === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {employeePage} of {totalEmployeePages}
                  </span>
                  <button
                    onClick={() => handleChangeEmployeePage(employeePage + 1)}
                    disabled={employeePage === totalEmployeePages}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
