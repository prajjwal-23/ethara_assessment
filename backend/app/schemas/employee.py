"""
Employee Pydantic schemas for request/response validation.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class EmployeeCreate(BaseModel):
    """Schema for creating a new employee."""

    employee_id: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Unique employee identifier",
        examples=["EMP001"],
    )
    full_name: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Full name of the employee",
        examples=["John Doe"],
    )
    email: EmailStr = Field(
        ...,
        description="Employee email address",
        examples=["john.doe@company.com"],
    )
    department: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Department of the employee",
        examples=["Engineering"],
    )


class EmployeeResponse(BaseModel):
    """Schema for employee response."""

    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EmployeeListResponse(BaseModel):
    """Schema for list of employees response."""

    success: bool = True
    data: list[EmployeeResponse]
    count: int


class EmployeeSingleResponse(BaseModel):
    """Schema for single employee response."""

    success: bool = True
    data: EmployeeResponse


class DeleteResponse(BaseModel):
    """Schema for delete operation response."""

    success: bool = True
    message: str
