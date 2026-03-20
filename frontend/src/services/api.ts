/**
 * API service module.
 * Centralized Axios instance and all API call functions.
 */

import axios from 'axios';
import type {
    Employee,
    EmployeeCreate,
    Attendance,
    AttendanceCreate,
    ApiListResponse,
    ApiSingleResponse,
    ApiDeleteResponse,
} from '../types';

// Base URL — uses Vite proxy in dev, env variable in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// -------- Employee API --------

/** Create a new employee */
export const createEmployee = async (data: EmployeeCreate): Promise<ApiSingleResponse<Employee>> => {
    const response = await api.post<ApiSingleResponse<Employee>>('/api/employees', data);
    return response.data;
};

/** Get all employees */
export const getEmployees = async (): Promise<ApiListResponse<Employee>> => {
    const response = await api.get<ApiListResponse<Employee>>('/api/employees');
    return response.data;
};

/** Delete an employee by database id */
export const deleteEmployee = async (id: number): Promise<ApiDeleteResponse> => {
    const response = await api.delete<ApiDeleteResponse>(`/api/employees/${id}`);
    return response.data;
};

// -------- Attendance API --------

/** Mark attendance for an employee */
export const markAttendance = async (data: AttendanceCreate): Promise<Attendance> => {
    const response = await api.post<Attendance>('/api/attendance', data);
    return response.data;
};

/** Get all attendance records */
export const getAllAttendance = async (): Promise<ApiListResponse<Attendance>> => {
    const response = await api.get<ApiListResponse<Attendance>>('/api/attendance');
    return response.data;
};

/** Get attendance records for a specific employee */
export const getAttendanceByEmployee = async (employeeId: string): Promise<ApiListResponse<Attendance>> => {
    const response = await api.get<ApiListResponse<Attendance>>(`/api/attendance/${employeeId}`);
    return response.data;
};

export default api;
