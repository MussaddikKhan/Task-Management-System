from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    role: str = "EMPLOYEE"

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=72)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True