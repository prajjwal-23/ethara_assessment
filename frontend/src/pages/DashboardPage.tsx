/**
 * Dashboard page with summary statistics.
 * Shows counts for employees, today's attendance, and present/absent breakdown.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ClipboardCheck, UserCheck, UserX, ArrowRight } from 'lucide-react';
import { getEmployees, getAllAttendance } from '../services/api';
import type { Employee, Attendance } from '../types';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    iconBg: string;
}

function StatCard({ title, value, icon: Icon, color, bgColor, iconBg }: StatCardProps) {
    return (
        <div className={`${bgColor} rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-smooth animate-fade-in`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [empRes, attRes] = await Promise.all([
                getEmployees(),
                getAllAttendance(),
            ]);
            setEmployees(empRes.data);
            setAttendance(attRes.data);
        } catch {
            setError('Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <LoadingSpinner message="Loading dashboard..." />;
    if (error) return <ErrorAlert message={error} onRetry={fetchData} />;

    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter((a) => a.date === today);
    const presentToday = todayAttendance.filter((a) => a.status === 'Present').length;
    const absentToday = todayAttendance.filter((a) => a.status === 'Absent').length;

    return (
        <div>
            <PageHeader
                title="Dashboard"
                subtitle="Overview of your workforce and attendance"
            />

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                <StatCard
                    title="Total Employees"
                    value={employees.length}
                    icon={Users}
                    color="text-indigo-600"
                    bgColor="bg-white"
                    iconBg="bg-indigo-50"
                />
                <StatCard
                    title="Today's Entries"
                    value={todayAttendance.length}
                    icon={ClipboardCheck}
                    color="text-blue-600"
                    bgColor="bg-white"
                    iconBg="bg-blue-50"
                />
                <StatCard
                    title="Present Today"
                    value={presentToday}
                    icon={UserCheck}
                    color="text-emerald-600"
                    bgColor="bg-white"
                    iconBg="bg-emerald-50"
                />
                <StatCard
                    title="Absent Today"
                    value={absentToday}
                    icon={UserX}
                    color="text-red-600"
                    bgColor="bg-white"
                    iconBg="bg-red-50"
                />
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Link
                    to="/employees/add"
                    className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-smooth flex items-center justify-between"
                >
                    <div>
                        <h3 className="font-semibold text-slate-900">Add New Employee</h3>
                        <p className="text-sm text-slate-500 mt-1">Register a new team member</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-smooth" />
                </Link>
                <Link
                    to="/attendance"
                    className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-smooth flex items-center justify-between"
                >
                    <div>
                        <h3 className="font-semibold text-slate-900">Mark Attendance</h3>
                        <p className="text-sm text-slate-500 mt-1">Record today's attendance</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-smooth" />
                </Link>
            </div>

            {/* Recent employees */}
            {employees.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Employees</h2>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                                            Employee
                                        </th>
                                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                                            Department
                                        </th>
                                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                                            ID
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.slice(0, 5).map((emp) => (
                                        <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-smooth">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{emp.full_name}</p>
                                                    <p className="text-xs text-slate-500">{emp.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600">{emp.department}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded-lg text-slate-600">
                                                    {emp.employee_id}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
