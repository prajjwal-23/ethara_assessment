/**
 * Add employee page.
 * Form with validation for creating new employee records.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { createEmployee } from '../services/api';
import type { EmployeeCreate } from '../types';
import PageHeader from '../components/PageHeader';
import toast from 'react-hot-toast';
import axios from 'axios';

const departments = [
    'Engineering',
    'Product',
    'Design',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'Customer Support',
    'Legal',
];

export default function AddEmployeePage() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<EmployeeCreate>({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const errs: Record<string, string> = {};
        if (!form.employee_id.trim()) errs.employee_id = 'Employee ID is required.';
        if (!form.full_name.trim()) errs.full_name = 'Full name is required.';
        if (!form.email.trim()) {
            errs.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errs.email = 'Enter a valid email address.';
        }
        if (!form.department.trim()) errs.department = 'Department is required.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear field error on change
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            await createEmployee(form);
            toast.success('Employee added successfully!');
            navigate('/employees');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.detail) {
                const detail = err.response.data.detail;
                const message = typeof detail === 'object' ? detail.message : detail;
                toast.error(message || 'Failed to add employee.');
            } else {
                toast.error('Failed to add employee.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="Add Employee"
                subtitle="Register a new team member"
                action={
                    <button
                        onClick={() => navigate('/employees')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-smooth"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                }
            />

            <div className="max-w-2xl">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 animate-fade-in"
                >
                    <div className="space-y-6">
                        {/* Employee ID */}
                        <div>
                            <label
                                htmlFor="employee_id"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Employee ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="employee_id"
                                name="employee_id"
                                value={form.employee_id}
                                onChange={handleChange}
                                placeholder="e.g. EMP001"
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-smooth ${errors.employee_id
                                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                                        : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                                    }`}
                            />
                            {errors.employee_id && (
                                <p className="text-xs text-red-500 mt-1">{errors.employee_id}</p>
                            )}
                        </div>

                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="full_name"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                value={form.full_name}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-smooth ${errors.full_name
                                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                                        : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                                    }`}
                            />
                            {errors.full_name && (
                                <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="e.g. john.doe@company.com"
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-smooth ${errors.email
                                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                                        : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Department */}
                        <div>
                            <label
                                htmlFor="department"
                                className="block text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Department <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="department"
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-smooth appearance-none bg-white ${errors.department
                                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                                        : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                                    }`}
                            >
                                <option value="">Select department</option>
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                            {errors.department && (
                                <p className="text-xs text-red-500 mt-1">{errors.department}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-smooth shadow-lg shadow-indigo-500/25 disabled:opacity-50"
                        >
                            {submitting ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {submitting ? 'Adding...' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
