/**
 * Mobile header component.
 * Premium mobile navigation with gradient background and smooth animations.
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
    Sparkles,
} from 'lucide-react';

const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/employees', label: 'Employees', icon: Users, end: true },
    { to: '/employees/add', label: 'Add Employee', icon: UserPlus, end: false },
    { to: '/attendance', label: 'Attendance', icon: ClipboardCheck, end: false },
];

export default function MobileHeader() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            {/* Top bar */}
            <div className="sidebar-gradient flex items-center justify-between px-5 py-4 relative overflow-hidden">
                {/* Orb */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="relative flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="text-white font-bold text-base">HRMS Lite</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative text-white p-2 rounded-xl hover:bg-white/10 transition-smooth"
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="sidebar-gradient border-t border-white/[0.06] px-4 py-3 animate-slide-down">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'nav-active text-white'
                                        : 'text-indigo-200/60 hover:bg-white/[0.04] hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="w-[18px] h-[18px]" />
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
}
