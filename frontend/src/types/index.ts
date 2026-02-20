/**
 * TypeScript interfaces for the HRMS Lite application.
 */

/** Employee record */
export interface Employee {
    id: number;
    employee_id: string;
    full_name: string;
    email: string;
    department: string;
    created_at: string;
}

/** Payload for creating an employee */
export interface EmployeeCreate {
    employee_id: string;
    full_name: string;
    email: string;
    department: string;
}

/** Attendance record */
export interface Attendance {
    id: number;
    employee_id: string;
    date: string;
    status: 'Present' | 'Absent';
    created_at: string;
}

/** Payload for marking attendance */
export interface AttendanceCreate {
    employee_id: string;
    date: string;
    status: 'Present' | 'Absent';
}

/** Generic API list response */
export interface ApiListResponse<T> {
    success: boolean;
    data: T[];
    count: number;
}

/** Generic API single response */
export interface ApiSingleResponse<T> {
    success: boolean;
    data: T;
}

/** API delete response */
export interface ApiDeleteResponse {
    success: boolean;
    message: string;
}

/** API error response */
export interface ApiErrorResponse {
    success: boolean;
    message: string;
    errors?: string[];
}
