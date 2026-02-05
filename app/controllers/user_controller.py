from fastapi import APIRouter, status
from app.schemas.user_schema import UserCreate, UserResponse
from app.services.user_service import user_service

router = APIRouter()

# # 1. REGISTER USER
# @router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
# async def register_user(user_in: UserCreate):
#     return await user_service.register_user(user_in)

# 2. GET USER BY ID
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    return await user_service.get_user_by_id(user_id)