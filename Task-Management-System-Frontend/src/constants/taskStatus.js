export const TASK_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in progress',
    COMPLETED: 'completed'
};

export const STATUS_DISPLAY_NAME = {
    [TASK_STATUS.PENDING]: 'Pending',
    [TASK_STATUS.IN_PROGRESS]: 'In Progress',
    [TASK_STATUS.COMPLETED]: 'Completed'
};

// Status colors for UI indicators
export const STATUS_COLORS = {
  [TASK_STATUS.PENDING]: '#f59e0b',      // Orange
  [TASK_STATUS.IN_PROGRESS]: '#3b82f6',   // Blue
  [TASK_STATUS.COMPLETED]: '#10b981'      // Green
};


//Valid status transitions
export const STATUS_TRANSITIONS = {
    [TASK_STATUS.PENDING]: [TASK_STATUS.IN_PROGRESS],
    [TASK_STATUS.IN_PROGRESS]:[TASK_STATUS.COMPLETED],
    [TASK_STATUS.COMPLETED]:[]
};

//check if transitions is valid
export const isValidStatusTransition = (currentStatus, newStatus) => {
    return STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) || false;
}