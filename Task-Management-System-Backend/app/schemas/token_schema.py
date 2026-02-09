from pydantic import BaseModel
from app.schemas.user_schema import UserResponse

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenWithUser(Token):
    user: UserResponse