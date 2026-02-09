from typing import Optional, List
from datetime import datetime, timezone

from app.database.database import db
from app.schemas.task_schema import TaskCreate, TaskUpdate, TaskResponse
from app.database.queries import (
    CREATE_TASK_SQL,
    GET_ALL_TASKS_SQL,
    GET_TASK_BY_ID_SQL,
    UPDATE_TASK_SQL,
    GET_TASKS_BY_USER_SQL,
    DELETE_TASK_SQL,
)

class TaskDAO:

    def _to_naive(self, dt):
        if dt and dt.tzinfo:
            return dt.replace(tzinfo=None)
        return dt

    async def create(self, task_in: TaskCreate) -> TaskResponse:

        now = datetime.now(timezone.utc).replace(tzinfo=None)

        due_date = self._to_naive(task_in.due_date)

        row = await db.fetch_one(
            CREATE_TASK_SQL,
            task_in.title,
            task_in.description,
            task_in.assigned_to_id,   # 🔥 employee id
            due_date,
            task_in.status,
            now,
            now
        )

        return TaskResponse(**dict(row))

    async def get_all(self) -> List[TaskResponse]:
        rows = await db.fetch_all(GET_ALL_TASKS_SQL)
        return [TaskResponse(**dict(r)) for r in rows]

    async def get_by_id(self, task_id: int) -> Optional[TaskResponse]:
        row = await db.fetch_one(GET_TASK_BY_ID_SQL, task_id)
        return TaskResponse(**dict(row)) if row else None

    async def update(self, task_id: int, task_update: TaskUpdate) -> Optional[TaskResponse]:

        now = datetime.now(timezone.utc).replace(tzinfo=None)
        due_date = self._to_naive(task_update.due_date)

        row = await db.fetch_one(
        UPDATE_TASK_SQL,
        task_update.title,           
        task_update.description,     
        task_update.assigned_to_id,  
        due_date,                   
        task_update.status,         
        now,                        
        task_id                      
        )

        return TaskResponse(**dict(row)) if row else None

    async def get_task_by_user_id(self, user_id: int) -> List[TaskResponse]:
        rows = await db.fetch_all(GET_TASKS_BY_USER_SQL, user_id)
        return [TaskResponse(**dict(r)) for r in rows]

    async def delete(self, task_id: int) -> None:
        await db.execute(DELETE_TASK_SQL, task_id)

task_dao = TaskDAO()
