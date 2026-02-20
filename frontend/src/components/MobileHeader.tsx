/**
 * Mobile header component.
 * Shown on small screens with a hamburger menu for navigation.
 */

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Menu,
    X,
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

export default function MobileHeader() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            {/* Top bar */}
            <div className="gradient-bg flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-indigo-300" />
                    <span className="text-white font-bold text-lg">HRMS Lite</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white p-2 rounded-lg hover:bg-white/10 transition-smooth"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="gradient-bg border-t border-white/10 px-4 py-3 animate-fade-in">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-smooth ${isActive
                                    ? 'bg-white/15 text-white'
                                    : 'text-indigo-200 hover:bg-white/8 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
}
