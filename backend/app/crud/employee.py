"""
Employee CRUD operations.
Handles all database operations for the Employee model.
"""

import logging
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate

logger = logging.getLogger(__name__)


def create_employee(db: Session, employee_data: EmployeeCreate) -> Employee:
    """
    Create a new employee record.
    Raises HTTPException if employee_id or email already exists.
    """
    # Check for duplicate employee_id
    existing_by_id = (
        db.query(Employee)
        .filter(Employee.employee_id == employee_data.employee_id)
        .first()
    )
    if existing_by_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "success": False,
                "message": f"Employee with ID '{employee_data.employee_id}' already exists.",
            },
        )

    # Check for duplicate email
    existing_by_email = (
        db.query(Employee)
        .filter(Employee.email == employee_data.email)
        .first()
    )
    if existing_by_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "success": False,
                "message": f"Employee with email '{employee_data.email}' already exists.",
            },
        )

    try:
        db_employee = Employee(
            employee_id=employee_data.employee_id,
            full_name=employee_data.full_name,
            email=employee_data.email,
            department=employee_data.department,
        )
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        logger.info(f"Created employee: {db_employee.employee_id}")
        return db_employee
    except IntegrityError as e:
        db.rollback()
        logger.error(f"IntegrityError creating employee: {e}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "success": False,
                "message": "Duplicate employee record. Check employee_id and email.",
            },
        )


def get_all_employees(db: Session) -> list[Employee]:
    """Retrieve all employee records ordered by creation date (newest first)."""
    return db.query(Employee).order_by(Employee.created_at.desc()).all()


def get_employee_by_id(db: Session, employee_id: str) -> Employee | None:
    """Retrieve a single employee by employee_id."""
    return db.query(Employee).filter(Employee.employee_id == employee_id).first()


def delete_employee(db: Session, employee_db_id: int) -> Employee:
    """
    Delete an employee by database primary key ID.
    Raises HTTPException if employee not found.
    """
    employee = db.query(Employee).filter(Employee.id == employee_db_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success": False,
                "message": f"Employee with ID {employee_db_id} not found.",
            },
        )

    db.delete(employee)
    db.commit()
    logger.info(f"Deleted employee: {employee.employee_id}")
    return employee
