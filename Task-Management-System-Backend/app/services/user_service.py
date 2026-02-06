from passlib.context import CryptContext
from fastapi import HTTPException, status
from app.dao.user_dao import UserDAO , user_dao
from app.schemas.user_schema import UserCreate, UserResponse


# Setup Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:

    def __init__(self, dao: UserDAO):
        self.user_dao = dao

    # --- HELPER: Hashing ---
    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)

    # --- HELPER: Verify ---
    def verify_password(self, plain_password, hashed_password) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    # --- LOGIC ---
    async def register_user(self, user_in: UserCreate) -> UserResponse:
        # 1. Check if email exists
        existing_user = await self.user_dao.get_by_email(user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # 2. Hash the password
        hashed_pwd = self.get_password_hash(user_in.password)

        # 3. Create User
        new_user = await self.user_dao.create(
            email=user_in.email, 
            password_hash=hashed_pwd, 
            role=user_in.role
        )

        return UserResponse.model_validate(new_user)

    async def get_user_by_id(self, user_id: int) -> UserResponse:
        user = await self.user_dao.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return UserResponse.model_validate(user)
    
    async def get_all_users(self) -> list[UserResponse]:
        users = await self.user_dao.get_all()
        return [UserResponse.model_validate(user) for user in users]

# Instantiate Service
user_service = UserService(user_dao)