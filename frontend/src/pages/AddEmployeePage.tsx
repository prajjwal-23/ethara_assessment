/**
 * Add employee page.
 * Premium form with gradient borders, animated focus states, and glass card.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Briefcase, Mail, Hash, User } from 'lucide-react';
import { createEmployee } from '../services/api';
import type { EmployeeCreate } from '../types';
import PageHeader from '../components/PageHeader';
import toast from 'react-hot-toast';
import axios from 'axios';

const departments = [
    'Engineering', 'Product', 'Design', 'Marketing', 'Sales',
    'Human Resources', 'Finance', 'Operations', 'Customer Support', 'Legal',
];

const departmentColors: Record<string, string> = {
    'Engineering': 'bg-indigo-400',
    'Product': 'bg-purple-400',
    'Design': 'bg-pink-400',
    'Marketing': 'bg-amber-400',
    'Sales': 'bg-emerald-400',
    'Human Resources': 'bg-blue-400',
    'Finance': 'bg-teal-400',
    'Operations': 'bg-orange-400',
    'Customer Support': 'bg-cyan-400',
    'Legal': 'bg-slate-400',
};

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
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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

    const inputClasses = (field: string) =>
        `w-full pl-11 pr-4 py-3 border rounded-xl text-sm transition-all duration-200 bg-white/60 backdrop-blur-sm focus-ring ${
            errors[field]
                ? 'border-rose-300 shadow-sm shadow-rose-100'
                : 'border-slate-200/60 hover:border-slate-300'
        }`;

    return (
        <div>
            <PageHeader
                title="Add Employee"
                subtitle="Register a new team member"
            />

            <div className="max-w-2xl animate-slide-up opacity-0">
                <div className="gradient-border">
                    <form
                        onSubmit={handleSubmit}
                        className="glass-card-solid rounded-2xl p-7 sm:p-9"
                    >
                        <div className="space-y-6">
                            {/* Employee ID */}
                            <div>
                                <label htmlFor="employee_id" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Employee ID <span className="text-rose-400">*</span>
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        id="employee_id"
                                        name="employee_id"
                                        value={form.employee_id}
                                        onChange={handleChange}
                                        placeholder="e.g. EMP001"
                                        className={inputClasses('employee_id')}
                                    />
                                </div>
                                {errors.employee_id && (
                                    <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-rose-400" />
                                        {errors.employee_id}
                                    </p>
                                )}
                            </div>

                            {/* Full Name */}
                            <div>
                                <label htmlFor="full_name" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Full Name <span className="text-rose-400">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        id="full_name"
                                        name="full_name"
                                        value={form.full_name}
                                        onChange={handleChange}
                                        placeholder="e.g. John Doe"
                                        className={inputClasses('full_name')}
                                    />
                                </div>
                                {errors.full_name && (
                                    <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-rose-400" />
                                        {errors.full_name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address <span className="text-rose-400">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="e.g. john.doe@company.com"
                                        className={inputClasses('email')}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-rose-400" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Department */}
                            <div>
                                <label htmlFor="department" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Department <span className="text-rose-400">*</span>
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        id="department"
                                        name="department"
                                        value={form.department}
                                        onChange={handleChange}
                                        className={`${inputClasses('department')} appearance-none cursor-pointer`}
                                    >
                                        <option value="">Select department</option>
                                        {departments.map((dept) => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                                {form.department && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${departmentColors[form.department] || 'bg-slate-400'}`} />
                                        <span className="text-xs text-slate-500">{form.department}</span>
                                    </div>
                                )}
                                {errors.department && (
                                    <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-rose-400" />
                                        {errors.department}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-9 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary inline-flex items-center gap-2 px-7 py-3 text-white text-sm font-semibold rounded-xl disabled:opacity-50 disabled:transform-none"
                            >
                                {submitting ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {submitting ? 'Adding...' : 'Add Employee'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
