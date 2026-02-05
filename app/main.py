import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.database.database import db
from app.controllers.user_controller import router  as user_router
from app.controllers.task_controller import router as task_router
from app.controllers.auth_controllers import router as auth_router # <--- IMPORT THIS
from app.exceptions.exception_handler import register_exception_handlers

# LIFESPAN (New/Better way than @app.on_event)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await db.connect()
    yield
    # Shutdown
    await db.disconnect()

app = FastAPI(lifespan=lifespan)

# register global exception handlers
register_exception_handlers(app)

# ROUTERS
app.include_router(auth_router, prefix="/auth", tags=["Auth"]) # <--- REGISTER THIS
app.include_router(task_router, prefix="/tasks", tags=["Tasks"])
app.include_router(user_router, prefix="/user", tags=["User"])


# RUN SERVER
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )