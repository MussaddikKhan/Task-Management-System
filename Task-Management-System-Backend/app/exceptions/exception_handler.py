from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from app.exceptions.NotFoundExcp import NotFoundError

def register_exception_handlers(app: FastAPI):

    @app.exception_handler(NotFoundError)
    async def not_found_handler(request: Request, exc: NotFoundError):
        return JSONResponse(
            status_code=404,
            content={"message": str(exc)}
        )
