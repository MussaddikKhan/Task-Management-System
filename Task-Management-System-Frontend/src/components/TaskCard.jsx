import React from 'react';
import { STATUS_COLORS, STATUS_DISPLAY_NAME } from '../constants/taskStatus';

import {formatDataForDisplay} from '../utils/validation';

import Button from './Button';
import './TaskCard.css';

const TaskCard = ({
    task,
    isAdmin= false,
    onEdit,
    onDelete,
    onStatusChange,
    canUpdateStatus = false
}) =>{
    const statusNorm = (task.status || '').toLowerCase();
    const statusColor = STATUS_COLORS[statusNorm] || '#6b7280';
    const statusDisplay = STATUS_DISPLAY_NAME[statusNorm] || task.status || statusNorm;

    return (
        <div className="task-card">
            <div className="task-card-header">
                <h3 className='task-title'>{task.title}</h3>
                <span className='task-status-badge' style={{backgroundColor:statusColor}}>{statusDisplay}

            </span>
            </div>
            {task.description && (
            <p className='task-description'>{task.description}</p>
        )}
            
            <div className='task-meta'>
                {task.due_date && (
                    <div className="task-meta-item"><strong>Due:</strong>{formatDataForDisplay(task.due_date)}
                    </div>
                )}

                <div className="task-meta-item"><strong>Created:</strong>{formatDataForDisplay(task.created_at)}
                </div>
            </div>
            <div className="task-actions">
                {isAdmin && (
                    <>
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => onEdit(task)}>
                                Edit
                        </Button>

                        <Button
                            variant="danger"
                            size="small"
                            onClick={() => onDelete(task.id)}
                        >Delete
                        </Button>

                    </>
                )}

                {(canUpdateStatus || !isAdmin) && statusNorm !== 'completed' && (
                    <Button 
                        variant="primary"
                        size="small"
                        onClick={() =>{
                            const nextStatus = statusNorm === 'pending' ? 'in progress' : 'completed';
                            onStatusChange(task.id, task.status, nextStatus);
                        }}
                    >{statusNorm === 'pending' ? 'Start Task' : 'Complete Task'}</Button>
                )}
            </div>
        </div>
        
    );
};

export default TaskCard;