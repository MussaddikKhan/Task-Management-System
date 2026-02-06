from fastapi import APIRouter, status, Depends
from typing import List

from app.schemas.user_schema import UserCreate, UserResponse
from app.services.user_service import user_service
from app.controllers.deps import require_admin
from app.models.user_model import User

router = APIRouter()

# GET ALL USERS (ADMIN ONLY)
@router.get("/", response_model=List[UserResponse])
async def get_all_users(current_user: User = Depends(require_admin)):
    return await user_service.get_all_users()

# GET USER BY ID
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    return await user_service.get_user_by_id(user_id)
