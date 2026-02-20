"""
Attendance SQLAlchemy model.
Represents the attendance table in the database.
"""

from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Attendance(Base):
    """Attendance database model."""

    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_id = Column(
        String(50),
        ForeignKey("employees.employee_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    date = Column(Date, nullable=False)
    status = Column(String(10), nullable=False)  # "Present" or "Absent"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Unique constraint: one attendance record per employee per date
    __table_args__ = (
        UniqueConstraint("employee_id", "date", name="uq_employee_date"),
    )

    # Relationship back to employee
    employee = relationship("Employee", back_populates="attendance_records")

    def __repr__(self) -> str:
        return f"<Attendance(employee_id='{self.employee_id}', date={self.date}, status='{self.status}')>"
