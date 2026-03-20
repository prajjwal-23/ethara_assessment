"""
Attendance API routes.
Endpoints for managing attendance records.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceResponse,
    AttendanceListResponse,
)
from app.crud.attendance import (
    create_attendance,
    get_all_attendance,
    get_attendance_by_employee,
)

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])


@router.post(
    "",
    response_model=AttendanceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Mark attendance",
    description="Mark attendance for an employee on a specific date.",
)
def mark_attendance(
    attendance_data: AttendanceCreate,
    db: Session = Depends(get_db),
):
    """Mark attendance for an employee."""
    attendance = create_attendance(db=db, attendance_data=attendance_data)
    return attendance


@router.get(
    "",
    response_model=AttendanceListResponse,
    summary="Get all attendance records",
    description="Retrieve all attendance records across all employees.",
)
def list_attendance(db: Session = Depends(get_db)):
    """Get all attendance records."""
    records = get_all_attendance(db=db)
    return AttendanceListResponse(
        success=True,
        data=records,
        count=len(records),
    )


@router.get(
    "/{employee_id}",
    response_model=AttendanceListResponse,
    summary="Get attendance by employee",
    description="Retrieve attendance records for a specific employee.",
)
def get_employee_attendance(
    employee_id: str,
    db: Session = Depends(get_db),
):
    """Get attendance records for a specific employee."""
    records = get_attendance_by_employee(db=db, employee_id=employee_id)
    return AttendanceListResponse(
        success=True,
        data=records,
        count=len(records),
    )
