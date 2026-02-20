"""
Employee SQLAlchemy model.
Represents the employees table in the database.
"""

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Employee(Base):
    """Employee database model."""

    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_id = Column(String(50), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    department = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to attendance records
    attendance_records = relationship(
        "Attendance",
        back_populates="employee",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Employee(id={self.id}, employee_id='{self.employee_id}', name='{self.full_name}')>"
