"""
Database configuration module.
Sets up SQLAlchemy engine, session, and declarative base.
Supports both PostgreSQL (production) and SQLite (local fallback).
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings


def _get_database_url() -> str:
    """Get the database URL, with fallback to SQLite if not set."""
    url = settings.DATABASE_URL
    if not url:
        return "sqlite:///./hrms_lite.db"
    # Render provides postgres:// but SQLAlchemy requires postgresql://
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return url


db_url = _get_database_url()
is_sqlite = db_url.startswith("sqlite")

# Connection arguments
connect_args: dict = {}
if is_sqlite:
    connect_args = {"check_same_thread": False}
else:
    # Render PostgreSQL requires SSL
    connect_args = {"sslmode": "require"}

# Create database engine with appropriate pool settings
if is_sqlite:
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        pool_pre_ping=True,
    )
else:
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base for ORM models
Base = declarative_base()


def get_db():
    """
    Dependency that provides a database session.
    Ensures the session is closed after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
