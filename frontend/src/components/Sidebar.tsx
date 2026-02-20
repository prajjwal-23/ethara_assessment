/**
 * Sidebar navigation component.
 * Highlights the active route and provides smooth navigation between pages.
 */

import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    UserPlus,
    ClipboardCheck,
    Building2,
} from 'lucide-react';

const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/employees', label: 'Employees', icon: Users },
    { to: '/employees/add', label: 'Add Employee', icon: UserPlus },
    { to: '/attendance', label: 'Attendance', icon: ClipboardCheck },
];

export default function Sidebar() {
    return (
        <aside className="hidden md:flex md:flex-col md:w-64 gradient-bg min-h-screen">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white tracking-tight">HRMS Lite</h1>
                    <p className="text-xs text-indigo-300">Employee Management</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-smooth ${isActive
                                ? 'bg-white/15 text-white shadow-lg shadow-indigo-900/20'
                                : 'text-indigo-200 hover:bg-white/8 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10">
                <p className="text-xs text-indigo-400">v1.0.0 • Admin</p>
            </div>
        </aside>
    );
}
