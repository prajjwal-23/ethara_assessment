/**
 * Employee list page.
 * Premium table with avatars, search glow, and staggered row animations.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Search, Users } from 'lucide-react';
import { getEmployees, deleteEmployee } from '../services/api';
import type { Employee } from '../types';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';

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

export default function EmployeeListPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [filtered, setFiltered] = useState<Employee[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchEmployees = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getEmployees();
            setEmployees(res.data || []);
            setFiltered(res.data || []);
        } catch {
            setError('Failed to load employees.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEmployees(); }, []);

    useEffect(() => {
        if (!search.trim()) { setFiltered(employees); return; }
        const q = search.toLowerCase();
        setFiltered(
            employees.filter(
                (e) =>
                    e.full_name.toLowerCase().includes(q) ||
                    e.employee_id.toLowerCase().includes(q) ||
                    e.email.toLowerCase().includes(q) ||
                    e.department.toLowerCase().includes(q)
            )
        );
    }, [search, employees]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteEmployee(deleteTarget.id);
            toast.success(`Employee "${deleteTarget.full_name}" deleted.`);
            setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch {
            toast.error('Failed to delete employee.');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <LoadingSpinner message="Loading employees..." />;
    if (error) return <ErrorAlert message={error} onRetry={fetchEmployees} />;

    return (
        <div>
            <PageHeader
                title="Employees"
                subtitle={`${employees.length} team member${employees.length !== 1 ? 's' : ''}`}
                action={
                    <Link
                        to="/employees/add"
                        className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl"
                    >
                        <Plus className="w-4 h-4" />
                        Add Employee
                    </Link>
                }
            />

            {employees.length === 0 ? (
                <EmptyState
                    title="No employees yet"
                    message="Start by adding your first employee to the system."
                    action={
                        <Link
                            to="/employees/add"
                            className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl"
                        >
                            <Plus className="w-4 h-4" />
                            Add Employee
                        </Link>
                    }
                />
            ) : (
                <>
                    {/* Search Bar */}
                    <div className="mb-6 animate-slide-up opacity-0 stagger-1">
                        <div className="relative max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, ID, email, or department..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 glass-card-solid rounded-xl text-sm focus-ring border border-slate-200/60 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Employee Count */}
                    <div className="flex items-center gap-2 mb-4 animate-slide-up opacity-0 stagger-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <p className="text-xs font-medium text-slate-400">
                            Showing {filtered.length} of {employees.length} employees
                        </p>
                    </div>

                    {/* Table */}
                    <div className="glass-card-solid rounded-2xl overflow-hidden animate-slide-up opacity-0 stagger-2">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100/80 bg-slate-50/30">
                                        <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">
                                            Employee
                                        </th>
                                        <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">
                                            ID
                                        </th>
                                        <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 hidden sm:table-cell">
                                            Department
                                        </th>
                                        <th className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-4 hidden lg:table-cell">
                                            Joined
                                        </th>
                                        <th className="text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((emp) => (
                                        <tr key={emp.id} className="table-row-hover border-b border-slate-50/80">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full ${getAvatarGradient(emp.full_name)} flex items-center justify-center flex-shrink-0`}>
                                                        <span className="text-xs font-bold text-white">
                                                            {emp.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">{emp.full_name}</p>
                                                        <p className="text-xs text-slate-400">{emp.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-mono bg-slate-100/80 px-2.5 py-1 rounded-lg text-slate-500">
                                                    {emp.employee_id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                <span className="inline-flex px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-lg">
                                                    {emp.department}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <span className="text-xs text-slate-400">
                                                    {new Date(emp.created_at).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setDeleteTarget(emp)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-500 hover:text-white hover:bg-rose-500 rounded-lg transition-smooth"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filtered.length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-sm text-slate-400">No employees match your search.</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete Employee"
                message={`Are you sure you want to delete "${deleteTarget?.full_name}"? This will also remove all their attendance records. This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                isLoading={deleting}
            />
        </div>
    );
}
