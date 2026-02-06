from typing import Optional , List
from datetime import datetime
from app.database.database import db
from app.models.user_model import User
from app.database.queries import CREATE_USER_SQL, GET_USER_BY_EMAIL_SQL, GET_USER_BY_ID_SQL, GET_ALL_USERS_SQL


class UserDAO:
    async def create(self, email: str, password_hash: str, role: str) -> User:
        now = datetime.now()
        row = await db.fetch_one(CREATE_USER_SQL, email, password_hash, role, now, now)
        return User(**dict(row))

    async def get_by_email(self, email: str) -> Optional[User]:
        row = await db.fetch_one(GET_USER_BY_EMAIL_SQL, email)
        if row: return User(**dict(row))
        return None
        
    async def get_by_id(self, user_id: int) -> Optional[User]:
        row = await db.fetch_one(GET_USER_BY_ID_SQL, user_id)
        if row: return User(**dict(row))
        return None
    
    async def get_all(self) -> List[User]:
        rows = await db.fetch_all(GET_ALL_USERS_SQL)
        return [User(**dict(row)) for row in rows]


user_dao = UserDAO()