from dataclasses import dataclass
from datetime import datetime
from app.models.enums.TaskStatus import TaskStatus

@dataclass
class Task:
    id: int
    title: str
    description: str
    assigned_user: int  
    status: TaskStatus
    due_date: datetime

    created_at: datetime
    updated_at: datetime