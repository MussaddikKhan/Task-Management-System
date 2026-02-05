from fastapi import APIRouter, status
from app.schemas.user_schema import UserCreate, UserResponse, UserLogin
from app.schemas.token_schema import Token
from app.services.auth_service import auth_service

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate):
    return await auth_service.register(user_in)

@router.post("/login", response_model=Token)
async def login(user_in: UserLogin):
    return await auth_service.login(user_in)