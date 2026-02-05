from fastapi import HTTPException, status
from app.dao.user_dao import user_dao
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token
from app.schemas.token_schema import Token

class AuthService:
    async def register(self, user_in: UserCreate) -> UserResponse:
        if await user_dao.get_by_email(user_in.email):
            raise HTTPException(status_code=400, detail="Email already registered")
            
        hashed_pwd = get_password_hash(user_in.password)
        new_user = await user_dao.create(user_in.email, hashed_pwd, user_in.role)
        return UserResponse.model_validate(new_user)

    async def login(self, user_in: UserLogin) -> Token:
        user = await user_dao.get_by_email(user_in.email)
        if not user or not verify_password(user_in.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Incorrect email or password")
            
        access_token = create_access_token(subject=user.id)
        return Token(access_token=access_token)

auth_service = AuthService()