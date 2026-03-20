"""
Attendance Pydantic schemas for request/response validation.
"""

import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class AttendanceCreate(BaseModel):
    """Schema for creating/marking attendance."""

    employee_id: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Employee identifier",
        examples=["EMP001"],
    )
    date: datetime.date = Field(
        ...,
        description="Attendance date",
        examples=["2026-02-20"],
    )
    status: str = Field(
        ...,
        description="Attendance status: Present or Absent",
        examples=["Present"],
    )

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        """Ensure status is either 'Present' or 'Absent'."""
        allowed = {"Present", "Absent"}
        if v not in allowed:
            raise ValueError(f"Status must be one of: {', '.join(allowed)}")
        return v


class AttendanceResponse(BaseModel):
    """Schema for attendance response."""

    id: int
    employee_id: str
    date: datetime.date
    status: str
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True


class AttendanceListResponse(BaseModel):
    """Schema for list of attendance records response."""

    success: bool = True
    data: list[AttendanceResponse]
    count: int

