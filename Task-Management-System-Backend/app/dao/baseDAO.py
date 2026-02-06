from app.database.database import db

class BaseDAO:

    async def fetch_one(self, query, *args):
        return await db.fetch_one(query, *args)

    async def fetch_all(self, query, *args):
        return await db.fetch_all(query, *args)

    async def execute(self, query, *args):
        return await db.execute(query, *args)
