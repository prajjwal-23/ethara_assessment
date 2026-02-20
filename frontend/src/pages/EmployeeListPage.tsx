/**
 * Employee list page.
 * Displays all employees in a table with delete functionality.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Search } from 'lucide-react';
import { getEmployees, deleteEmployee } from '../services/api';
import type { Employee } from '../types';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';

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
            setEmployees(res.data);
            setFiltered(res.data);
        } catch {
            setError('Failed to load employees.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Search filter
    useEffect(() => {
        if (!search.trim()) {
            setFiltered(employees);
            return;
        }
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
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-smooth shadow-lg shadow-indigo-500/25"
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
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-smooth shadow-lg shadow-indigo-500/25"
                        >
                            <Plus className="w-4 h-4" />
                            Add Employee
                        </Link>
                    }
                />
            ) : (
                <>
                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, ID, email, or department..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-smooth"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                                            Employee ID
                                        </th>
                                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                                            Full Name
                                        </th>
                                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                                            Email
                                        </th>
                                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                                            Department
                                        </th>
                                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                                            Created
                                        </th>
                                        <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((emp) => (
                                        <tr
                                            key={emp.id}
                                            className="border-b border-slate-50 hover:bg-slate-50/50 transition-smooth"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                                                    {emp.employee_id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-900">
                                                    {emp.full_name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600">{emp.email}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg">
                                                    {emp.department}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-slate-500">
                                                    {new Date(emp.created_at).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setDeleteTarget(emp)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-smooth"
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
                                <p className="text-sm text-slate-500">No employees match your search.</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Delete confirmation modal */}
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
