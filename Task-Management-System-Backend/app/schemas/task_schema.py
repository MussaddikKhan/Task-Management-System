from pydantic import BaseModel, Field 
from datetime import datetime
from typing import Optional
from app.models.enums.TaskStatus import TaskStatus


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to_id: int  # employee id
    due_date: Optional[datetime] = None
    status: TaskStatus = TaskStatus.PENDING


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    assigned_to_id: Optional[int] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[TaskStatus] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    assigned_to_id: int
    status: TaskStatus
    due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
