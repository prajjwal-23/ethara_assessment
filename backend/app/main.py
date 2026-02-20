"""
HRMS Lite - FastAPI Application Entry Point.
Configures CORS, exception handlers, routers, and creates database tables.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.core.config import settings
from app.core.database import engine, Base
from app.api.routes import employees, attendance

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — create tables on startup."""
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully.")
    yield
    logger.info("Application shutting down.")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="A lightweight Human Resource Management System for managing employees and tracking attendance.",
    lifespan=lifespan,
)

# ----- CORS Middleware -----
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----- Global Exception Handlers -----

@app.exception_handler(ValidationError)
async def pydantic_validation_exception_handler(request: Request, exc: ValidationError):
    """Handle Pydantic validation errors."""
    errors = exc.errors()
    messages = [f"{err['loc'][-1]}: {err['msg']}" for err in errors]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": "Validation error",
            "errors": messages,
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An internal server error occurred. Please try again later.",
        },
    )


# ----- Register Routers -----
app.include_router(employees.router)
app.include_router(attendance.router)


# ----- Health Check -----

@app.get("/", tags=["Health"])
def health_check():
    """Root endpoint — health check."""
    return {
        "success": True,
        "message": f"{settings.APP_NAME} v{settings.APP_VERSION} is running.",
    }


@app.get("/api/health", tags=["Health"])
def api_health():
    """API health check endpoint."""
    return {
        "success": True,
        "message": "API is healthy.",
        "version": settings.APP_VERSION,
    }
