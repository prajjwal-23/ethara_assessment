/**
 * Attendance page.
 * Mark attendance for employees and view attendance records.
 */

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Filter } from 'lucide-react';
import {
    getEmployees,
    getAllAttendance,
    getAttendanceByEmployee,
    markAttendance,
} from '../services/api';
import type { Employee, Attendance, AttendanceCreate } from '../types';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function AttendancePage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [records, setRecords] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterEmployee, setFilterEmployee] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [form, setForm] = useState<AttendanceCreate>({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [empRes, attRes] = await Promise.all([
                getEmployees(),
                getAllAttendance(),
            ]);
            setEmployees(empRes.data);
            setRecords(attRes.data);
        } catch {
            setError('Failed to load data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Filter attendance records by employee
    const handleFilterChange = async (employeeId: string) => {
        setFilterEmployee(employeeId);
        if (!employeeId) {
            // Reset to all records
            try {
                const res = await getAllAttendance();
                setRecords(res.data);
            } catch {
                toast.error('Failed to fetch records.');
            }
            return;
        }
        try {
            const res = await getAttendanceByEmployee(employeeId);
            setRecords(res.data);
        } catch {
            toast.error('Failed to fetch attendance for this employee.');
        }
    };

    const validate = (): boolean => {
        const errs: Record<string, string> = {};
        if (!form.employee_id) errs.employee_id = 'Select an employee.';
        if (!form.date) errs.date = 'Select a date.';
        if (!form.status) errs.status = 'Select a status.';
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            await markAttendance(form);
            toast.success('Attendance marked successfully!');
            // Refresh records
            if (filterEmployee) {
                const res = await getAttendanceByEmployee(filterEmployee);
                setRecords(res.data);
            } else {
                const res = await getAllAttendance();
                setRecords(res.data);
            }
            // Reset form
            setForm((prev) => ({ ...prev, employee_id: '' }));
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.detail) {
                const detail = err.response.data.detail;
                const message = typeof detail === 'object' ? detail.message : detail;
                toast.error(message || 'Failed to mark attendance.');
            } else {
                toast.error('Failed to mark attendance.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner message="Loading attendance data..." />;
    if (error) return <ErrorAlert message={error} onRetry={fetchData} />;

    // Helper: get employee name by ID
    const getEmployeeName = (empId: string): string => {
        const emp = employees.find((e) => e.employee_id === empId);
        return emp ? emp.full_name : empId;
    };

    return (
        <div>
            <PageHeader
                title="Attendance"
                subtitle="Mark and view daily attendance records"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mark Attendance Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-fade-in sticky top-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-500" />
                            Mark Attendance
                        </h2>

                        {employees.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No employees found. Add employees first.
                            </p>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Employee select */}
                                <div>
                                    <label
                                        htmlFor="att_employee_id"
                                        className="block text-sm font-medium text-slate-700 mb-1.5"
                                    >
                                        Employee <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="att_employee_id"
                                        value={form.employee_id}
                                        onChange={(e) => {
                                            setForm((prev) => ({ ...prev, employee_id: e.target.value }));
                                            if (formErrors.employee_id)
                                                setFormErrors((prev) => ({ ...prev, employee_id: '' }));
                                        }}
                                        className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-smooth appearance-none bg-white ${formErrors.employee_id
                                                ? 'border-red-300 focus:ring-red-500/20'
                                                : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                                            }`}
                                    >
                                        <option value="">Select employee</option>
                                        {employees.map((emp) => (
                                            <option key={emp.employee_id} value={emp.employee_id}>
                                                {emp.full_name} ({emp.employee_id})
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.employee_id && (
                                        <p className="text-xs text-red-500 mt-1">{formErrors.employee_id}</p>
                                    )}
                                </div>

                                {/* Date */}
                                <div>
                                    <label
                                        htmlFor="att_date"
                                        className="block text-sm font-medium text-slate-700 mb-1.5"
                                    >
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="att_date"
                                        value={form.date}
                                        onChange={(e) => {
                                            setForm((prev) => ({ ...prev, date: e.target.value }));
                                            if (formErrors.date)
                                                setFormErrors((prev) => ({ ...prev, date: '' }));
                                        }}
                                        className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-smooth ${formErrors.date
                                                ? 'border-red-300 focus:ring-red-500/20'
                                                : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                                            }`}
                                    />
                                    {formErrors.date && (
                                        <p className="text-xs text-red-500 mt-1">{formErrors.date}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-3">
                                        {(['Present', 'Absent'] as const).map((s) => (
                                            <button
                                                type="button"
                                                key={s}
                                                onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                                                className={`flex-1 py-2.5 text-sm font-medium rounded-xl border transition-smooth ${form.status === s
                                                        ? s === 'Present'
                                                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                                            : 'bg-red-50 border-red-300 text-red-700'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-smooth shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting && (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    )}
                                    {submitting ? 'Marking...' : 'Mark Attendance'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Attendance Records */}
                <div className="lg:col-span-2">
                    {/* Filter */}
                    <div className="mb-5 flex items-center gap-3">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                            value={filterEmployee}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-smooth appearance-none bg-white"
                        >
                            <option value="">All Employees</option>
                            {employees.map((emp) => (
                                <option key={emp.employee_id} value={emp.employee_id}>
                                    {emp.full_name} ({emp.employee_id})
                                </option>
                            ))}
                        </select>
                    </div>

                    {records.length === 0 ? (
                        <EmptyState
                            title="No attendance records"
                            message="No attendance records found. Start by marking attendance for an employee."
                        />
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50">
                                            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                                                Employee
                                            </th>
                                            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                                                Employee ID
                                            </th>
                                            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                                                Date
                                            </th>
                                            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.map((rec) => (
                                            <tr
                                                key={rec.id}
                                                className="border-b border-slate-50 hover:bg-slate-50/50 transition-smooth"
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-medium text-slate-900">
                                                        {getEmployeeName(rec.employee_id)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600">
                                                        {rec.employee_id}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-600">
                                                        {new Date(rec.date).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={rec.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
