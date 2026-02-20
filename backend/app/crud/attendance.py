"""
Attendance CRUD operations.
Handles all database operations for the Attendance model.
"""

import logging
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app.models.attendance import Attendance
from app.models.employee import Employee
from app.schemas.attendance import AttendanceCreate

logger = logging.getLogger(__name__)


def create_attendance(db: Session, attendance_data: AttendanceCreate) -> Attendance:
    """
    Mark attendance for an employee.
    Validates employee exists and prevents duplicate entries.
    """
    # Verify the employee exists
    employee = (
        db.query(Employee)
        .filter(Employee.employee_id == attendance_data.employee_id)
        .first()
    )
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success": False,
                "message": f"Employee with ID '{attendance_data.employee_id}' does not exist.",
            },
        )

    # Check for duplicate attendance on the same date
    existing = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == attendance_data.employee_id,
            Attendance.date == attendance_data.date,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "success": False,
                "message": f"Attendance for employee '{attendance_data.employee_id}' on {attendance_data.date} already exists.",
            },
        )

    try:
        db_attendance = Attendance(
            employee_id=attendance_data.employee_id,
            date=attendance_data.date,
            status=attendance_data.status,
        )
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        logger.info(
            f"Marked attendance: {db_attendance.employee_id} - {db_attendance.date} - {db_attendance.status}"
        )
        return db_attendance
    except IntegrityError as e:
        db.rollback()
        logger.error(f"IntegrityError creating attendance: {e}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "success": False,
                "message": "Duplicate attendance entry.",
            },
        )


def get_all_attendance(db: Session) -> list[Attendance]:
    """Retrieve all attendance records ordered by date (newest first)."""
    return db.query(Attendance).order_by(Attendance.date.desc()).all()


def get_attendance_by_employee(db: Session, employee_id: str) -> list[Attendance]:
    """
    Retrieve attendance records for a specific employee.
    Validates that the employee exists first.
    """
    # Verify employee exists
    employee = (
        db.query(Employee)
        .filter(Employee.employee_id == employee_id)
        .first()
    )
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success": False,
                "message": f"Employee with ID '{employee_id}' does not exist.",
            },
        )

    return (
        db.query(Attendance)
        .filter(Attendance.employee_id == employee_id)
        .order_by(Attendance.date.desc())
        .all()
    )
