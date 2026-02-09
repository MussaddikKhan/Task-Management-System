import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from starlette.middleware.base import BaseHTTPMiddleware

from app.database.database import db
from app.controllers.user_controller import router  as user_router
from app.controllers.task_controller import router as task_router
from app.controllers.auth_controllers import router as auth_router # <--- IMPORT THIS
from app.exceptions.exception_handler import register_exception_handlers

CORS_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]


class AddCORSHeadersMiddleware(BaseHTTPMiddleware):
    """Ensure CORS headers are on every response (including errors)."""
    async def dispatch(self, request, call_next):
        if request.method == "OPTIONS":
            return JSONResponse(
                status_code=200,
                headers={
                    "Access-Control-Allow-Origin": request.headers.get("origin") or CORS_ORIGINS[0],
                    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Max-Age": "86400",
                },
            )
        response = await call_next(request)
        origin = request.headers.get("origin")
        if origin in CORS_ORIGINS:
            response.headers["Access-Control-Allow-Origin"] = origin
        else:
            response.headers["Access-Control-Allow-Origin"] = CORS_ORIGINS[0]
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept"
        return response


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()


app = FastAPI(lifespan=lifespan)

app.add_middleware(AddCORSHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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