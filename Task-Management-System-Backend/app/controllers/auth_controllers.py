from fastapi import APIRouter, status, Depends
from app.schemas.user_schema import UserCreate, UserResponse, UserLogin
from app.schemas.token_schema import TokenWithUser
from app.services.auth_service import auth_service
from app.controllers.deps import get_current_user
from app.models.user_model import User

router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate):
    """Alias for register."""
    return await auth_service.register(user_in)

@router.post("/login", response_model=TokenWithUser)
async def login(user_in: UserLogin):
    return await auth_service.login(user_in)

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)