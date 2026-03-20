"""
Employee API routes.
Endpoints for managing employee records.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.employee import (
    EmployeeCreate,
    EmployeeListResponse,
    EmployeeSingleResponse,
    DeleteResponse,
)
from app.crud.employee import (
    create_employee,
    get_all_employees,
    delete_employee,
)

router = APIRouter(prefix="/api/employees", tags=["Employees"])


@router.post(
    "",
    response_model=EmployeeSingleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new employee",
    description="Create a new employee record with unique employee_id and email.",
)
def add_employee(
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db),
):
    """Create a new employee."""
    employee = create_employee(db=db, employee_data=employee_data)
    return EmployeeSingleResponse(success=True, data=employee)


@router.get(
    "",
    response_model=EmployeeListResponse,
    summary="Get all employees",
    description="Retrieve a list of all employee records.",
)
def list_employees(db: Session = Depends(get_db)):
    """Get all employees."""
    employees = get_all_employees(db=db)
    return EmployeeListResponse(
        success=True,
        data=employees,
        count=len(employees),
    )


@router.delete(
    "/{employee_id}",
    response_model=DeleteResponse,
    summary="Delete an employee",
    description="Delete an employee by their database ID. Also removes associated attendance records.",
)
def remove_employee(
    employee_id: int,
    db: Session = Depends(get_db),
):
    """Delete an employee by ID."""
    employee = delete_employee(db=db, employee_db_id=employee_id)
    return DeleteResponse(
        success=True,
        message=f"Employee '{employee.full_name}' (ID: {employee.employee_id}) deleted successfully.",
    )
