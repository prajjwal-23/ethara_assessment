/**
 * Dashboard page with premium summary statistics.
 * Welcome banner, animated stat cards, quick actions, and recent employees.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    ClipboardCheck,
    UserCheck,
    UserX,
    ArrowRight,
    UserPlus,
    CalendarCheck,
    TrendingUp,
} from 'lucide-react';
import { getEmployees, getAllAttendance } from '../services/api';
import type { Employee, Attendance } from '../types';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

/* ---- Helper: avatar gradient from name ---- */
const avatarGradients = [
    'avatar-gradient-1',
    'avatar-gradient-2',
    'avatar-gradient-3',
    'avatar-gradient-4',
    'avatar-gradient-5',
];
function getAvatarGradient(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return avatarGradients[Math.abs(hash) % avatarGradients.length];
}

/* ---- Stat Card ---- */
interface StatCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    gradient: string;
    iconColor: string;
    delay: string;
}

function StatCard({ title, value, icon: Icon, gradient, iconColor, delay }: StatCardProps) {
    return (
        <div className={`glass-card-solid rounded-2xl p-6 stat-card animate-slide-up opacity-0 ${delay}`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</p>
            <p className="text-sm text-slate-400 font-medium mt-1">{title}</p>
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
            setEmployees(empRes.data || []);
            setAttendance(attRes.data || []);
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
            <PageHeader title="Dashboard" subtitle="Overview of your workforce and attendance" />

            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl p-7 mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 animate-slide-up opacity-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
                <div className="absolute bottom-0 left-20 w-40 h-40 bg-purple-400/10 rounded-full translate-y-1/2 blur-2xl" />
                <div className="relative">
                    <h2 className="text-xl font-bold text-white mb-1.5">Welcome back, Admin 👋</h2>
                    <p className="text-indigo-100/70 text-sm max-w-lg">
                        Your team has {employees.length} member{employees.length !== 1 ? 's' : ''}.
                        {todayAttendance.length > 0
                            ? ` ${presentToday} present today.`
                            : ' No attendance marked yet today.'}
                    </p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard
                    title="Total Employees"
                    value={employees.length}
                    icon={Users}
                    gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
                    iconColor="text-white"
                    delay="stagger-1"
                />
                <StatCard
                    title="Today's Entries"
                    value={todayAttendance.length}
                    icon={ClipboardCheck}
                    gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
                    iconColor="text-white"
                    delay="stagger-2"
                />
                <StatCard
                    title="Present Today"
                    value={presentToday}
                    icon={UserCheck}
                    gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
                    iconColor="text-white"
                    delay="stagger-3"
                />
                <StatCard
                    title="Absent Today"
                    value={absentToday}
                    icon={UserX}
                    gradient="bg-gradient-to-br from-rose-500 to-pink-500"
                    iconColor="text-white"
                    delay="stagger-4"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <Link
                    to="/employees/add"
                    className="group glass-card-solid rounded-2xl p-6 flex items-center gap-5 stat-card animate-slide-up opacity-0 stagger-5"
                >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-smooth">
                        <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">Add New Employee</h3>
                        <p className="text-sm text-slate-400 mt-0.5">Register a new team member</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-smooth" />
                </Link>
                <Link
                    to="/attendance"
                    className="group glass-card-solid rounded-2xl p-6 flex items-center gap-5 stat-card animate-slide-up opacity-0 stagger-6"
                >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-smooth">
                        <CalendarCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">Mark Attendance</h3>
                        <p className="text-sm text-slate-400 mt-0.5">Record today's attendance</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-smooth" />
                </Link>
            </div>

            {/* Recent Employees */}
            {employees.length > 0 && (
                <div className="animate-slide-up opacity-0 stagger-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-slate-700">Recent Employees</h2>
                        <Link to="/employees" className="text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-smooth">
                            View all →
                        </Link>
                    </div>
                    <div className="glass-card-solid rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100/80">
                                        <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">
                                            Employee
                                        </th>
                                        <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">
                                            Department
                                        </th>
                                        <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">
                                            ID
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.slice(0, 5).map((emp, i) => (
                                        <tr key={emp.id} className={`table-row-hover border-b border-slate-50/80 animate-slide-up opacity-0 stagger-${Math.min(i + 1, 6)}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full ${getAvatarGradient(emp.full_name)} flex items-center justify-center flex-shrink-0`}>
                                                        <span className="text-xs font-bold text-white">
                                                            {emp.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800">{emp.full_name}</p>
                                                        <p className="text-xs text-slate-400">{emp.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-lg">
                                                    {emp.department}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-lg text-slate-500">
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
