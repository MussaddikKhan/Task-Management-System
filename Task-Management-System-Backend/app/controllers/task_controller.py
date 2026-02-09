from fastapi import APIRouter, status, Body, Depends, HTTPException
from typing import List

from app.schemas.task_schema import TaskCreate, TaskResponse, TaskUpdate
from app.models.enums.TaskStatus import TaskStatus
from app.models.user_model import User
from app.dependencies import task_service

# IMPORT ADMIN GUARD
from app.controllers.deps import get_current_user, require_admin

router = APIRouter()


# ADMIN ONLY → CREATE TASK
@router.post("/", response_model=TaskResponse)
async def create_task(
    task_in: TaskCreate,
    current_user: User = Depends(require_admin)   # admin only
):
    return await task_service.create_task(task_in)


# ADMIN ONLY → VIEW ALL TASKS
@router.get("/", response_model=List[TaskResponse])
async def get_tasks(
    current_user: User = Depends(require_admin)   # ADMIN ONLY
):
    return await task_service.get_all_tasks()

# EMPLOYEE → VIEW OWN TASKS
@router.get("/my-tasks", response_model=List[TaskResponse])
async def get_my_tasks(
    current_user: User = Depends(get_current_user)
):
    return await task_service.get_user_task(current_user.id)



# GET SINGLE TASK (AUTHENTICATED) (Remove)
@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user)
):
    task = await task_service.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


# ADMIN → UPDATE TASK DETAILS

@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(require_admin)   #  ADMIN ONLY
):
    updated_task = await task_service.update_task(task_id, task_update)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task


# ADMIN ONLY → DELETE TASK
@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    current_user: User = Depends(require_admin),
):
    await task_service.delete_task(task_id)


# EMPLOYEE → UPDATE STATUS
@router.patch("/{task_id}/status", response_model=TaskResponse)
async def update_status(
    task_id: int,
    new_status: TaskStatus = Body(..., embed=True),
    current_user: User = Depends(get_current_user)
):
    result = await task_service.update_status(current_user.id, task_id, new_status)

    if not result:
        raise HTTPException(status_code=400, detail="Could not update status.")

    return result
