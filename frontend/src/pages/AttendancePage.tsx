/**
 * Attendance page.
 * Mark attendance with animated toggle and view records in premium table.
 */

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Filter, CalendarCheck, Clock } from 'lucide-react';
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

/* ---- Avatar gradient from name ---- */
const avatarGradients = [
    'avatar-gradient-1', 'avatar-gradient-2', 'avatar-gradient-3',
    'avatar-gradient-4', 'avatar-gradient-5',
];
function getAvatarGradient(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return avatarGradients[Math.abs(hash) % avatarGradients.length];
}

export default function AttendancePage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [records, setRecords] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterEmployee, setFilterEmployee] = useState('');
    const [submitting, setSubmitting] = useState(false);

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
            setEmployees(empRes.data || []);
            setRecords(attRes.data || []);
        } catch {
            setError('Failed to load data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleFilterChange = async (employeeId: string) => {
        setFilterEmployee(employeeId);
        if (!employeeId) {
            try { const res = await getAllAttendance(); setRecords(res.data); }
            catch { toast.error('Failed to fetch records.'); }
            return;
        }
        try { const res = await getAttendanceByEmployee(employeeId); setRecords(res.data); }
        catch { toast.error('Failed to fetch attendance for this employee.'); }
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
            if (filterEmployee) {
                const res = await getAttendanceByEmployee(filterEmployee);
                setRecords(res.data);
            } else {
                const res = await getAllAttendance();
                setRecords(res.data);
            }
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

    const getEmployeeName = (empId: string): string => {
        const emp = employees.find((e) => e.employee_id === empId);
        return emp ? emp.full_name : empId;
    };

    return (
        <div>
            <PageHeader title="Attendance" subtitle="Mark and view daily attendance records" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mark Attendance Form */}
                <div className="lg:col-span-1 animate-slide-up opacity-0 stagger-1">
                    <div className="gradient-border sticky top-6">
                        <div className="glass-card-solid rounded-2xl p-6">
                            <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <CalendarCheck className="w-4.5 h-4.5 text-white" />
                                </div>
                                Mark Attendance
                            </h2>

                            {employees.length === 0 ? (
                                <p className="text-sm text-slate-400">No employees found. Add employees first.</p>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Employee select */}
                                    <div>
                                        <label htmlFor="att_employee_id" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Employee <span className="text-rose-400">*</span>
                                        </label>
                                        <select
                                            id="att_employee_id"
                                            value={form.employee_id}
                                            onChange={(e) => {
                                                setForm((prev) => ({ ...prev, employee_id: e.target.value }));
                                                if (formErrors.employee_id) setFormErrors((prev) => ({ ...prev, employee_id: '' }));
                                            }}
                                            className={`w-full px-4 py-3 border rounded-xl text-sm appearance-none bg-white/60 backdrop-blur-sm cursor-pointer focus-ring ${
                                                formErrors.employee_id
                                                    ? 'border-rose-300'
                                                    : 'border-slate-200/60 hover:border-slate-300'
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
                                            <p className="text-xs text-rose-500 mt-1.5">{formErrors.employee_id}</p>
                                        )}
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <label htmlFor="att_date" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Date <span className="text-rose-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            <input
                                                type="date"
                                                id="att_date"
                                                value={form.date}
                                                onChange={(e) => {
                                                    setForm((prev) => ({ ...prev, date: e.target.value }));
                                                    if (formErrors.date) setFormErrors((prev) => ({ ...prev, date: '' }));
                                                }}
                                                className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm bg-white/60 backdrop-blur-sm focus-ring ${
                                                    formErrors.date
                                                        ? 'border-rose-300'
                                                        : 'border-slate-200/60 hover:border-slate-300'
                                                }`}
                                            />
                                        </div>
                                        {formErrors.date && (
                                            <p className="text-xs text-rose-500 mt-1.5">{formErrors.date}</p>
                                        )}
                                    </div>

                                    {/* Status Toggle */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Status <span className="text-rose-400">*</span>
                                        </label>
                                        <div className="flex gap-3">
                                            {(['Present', 'Absent'] as const).map((s) => (
                                                <button
                                                    type="button"
                                                    key={s}
                                                    onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                                                    className={`flex-1 py-3 text-sm font-semibold rounded-xl border-2 transition-all duration-200 ${
                                                        form.status === s
                                                            ? s === 'Present'
                                                                ? 'bg-emerald-50 border-emerald-400 text-emerald-700 shadow-sm shadow-emerald-100'
                                                                : 'bg-rose-50 border-rose-400 text-rose-700 shadow-sm shadow-rose-100'
                                                            : 'bg-white/60 border-slate-200/60 text-slate-500 hover:border-slate-300 hover:bg-white'
                                                    }`}
                                                >
                                                    <span className="flex items-center justify-center gap-2">
                                                        {form.status === s && (
                                                            <span className={`w-2 h-2 rounded-full ${
                                                                s === 'Present' ? 'bg-emerald-500' : 'bg-rose-500'
                                                            } animate-pulse-dot`} />
                                                        )}
                                                        {s}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full btn-primary py-3 text-white text-sm font-semibold rounded-xl disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                                    >
                                        {submitting && (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        )}
                                        {submitting ? 'Marking...' : 'Mark Attendance'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Attendance Records */}
                <div className="lg:col-span-2 animate-slide-up opacity-0 stagger-2">
                    {/* Filter */}
                    <div className="mb-5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Filter className="w-4 h-4 text-slate-400" />
                        </div>
                        <select
                            value={filterEmployee}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="px-4 py-2.5 border border-slate-200/60 rounded-xl text-sm bg-white/60 backdrop-blur-sm appearance-none cursor-pointer focus-ring hover:border-slate-300 transition-smooth"
                        >
                            <option value="">All Employees</option>
                            {employees.map((emp) => (
                                <option key={emp.employee_id} value={emp.employee_id}>
                                    {emp.full_name} ({emp.employee_id})
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-auto">
                            <Clock className="w-3.5 h-3.5" />
                            {records.length} record{records.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {records.length === 0 ? (
                        <EmptyState
                            title="No attendance records"
                            message="No attendance records found. Start by marking attendance for an employee."
                        />
                    ) : (
                        <div className="glass-card-solid rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100/80 bg-slate-50/30">
                                            <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">
                                                Employee
                                            </th>
                                            <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 hidden sm:table-cell">
                                                ID
                                            </th>
                                            <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">
                                                Date
                                            </th>
                                            <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.map((rec) => {
                                            const empName = getEmployeeName(rec.employee_id);
                                            return (
                                                <tr key={rec.id} className="table-row-hover border-b border-slate-50/80">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-9 h-9 rounded-full ${getAvatarGradient(empName)} flex items-center justify-center flex-shrink-0`}>
                                                                <span className="text-[10px] font-bold text-white">
                                                                    {empName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-800">{empName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 hidden sm:table-cell">
                                                        <span className="text-xs font-mono bg-slate-100/80 px-2.5 py-1 rounded-lg text-slate-500">
                                                            {rec.employee_id}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-slate-600">
                                                            {new Date(rec.date).toLocaleDateString('en-US', {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <StatusBadge status={rec.status} />
                                                    </td>
                                                </tr>
                                            );
                                        })}
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
