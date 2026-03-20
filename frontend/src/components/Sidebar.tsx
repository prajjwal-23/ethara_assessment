/**
 * Sidebar navigation component.
 * Premium glassmorphic dark sidebar with gradient orbs and glowing active state.
 */

import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    UserPlus,
    ClipboardCheck,
    Sparkles,
    ChevronRight,
} from 'lucide-react';

const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview', end: true },
    { to: '/employees', label: 'Employees', icon: Users, desc: 'Team directory', end: true },
    { to: '/employees/add', label: 'Add Employee', icon: UserPlus, desc: 'New member', end: false },
    { to: '/attendance', label: 'Attendance', icon: ClipboardCheck, desc: 'Daily records', end: false },
];

export default function Sidebar() {
    return (
        <aside className="hidden md:flex md:flex-col md:w-72 sidebar-gradient min-h-screen relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute top-20 -left-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 -right-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl" />

            {/* Logo */}
            <div className="relative flex items-center gap-3.5 px-7 py-7 border-b border-white/[0.06]">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Sparkles className="w-5.5 h-5.5 text-white" />
                </div>
                <div>
                    <h1 className="text-[17px] font-bold text-white tracking-tight">HRMS Lite</h1>
                    <p className="text-[11px] text-indigo-300/70 font-medium">People Management</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="relative flex-1 px-4 py-6 space-y-1">
                <p className="px-4 mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-400/50">
                    Menu
                </p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                            `group flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? 'nav-active text-white'
                                    : 'text-indigo-200/60 hover:text-white hover:bg-white/[0.04]'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                    isActive
                                        ? 'bg-indigo-500/20 shadow-sm shadow-indigo-500/10'
                                        : 'bg-white/[0.04] group-hover:bg-white/[0.08]'
                                }`}>
                                    <item.icon className={`w-[18px] h-[18px] transition-colors ${
                                        isActive ? 'text-indigo-300' : 'text-indigo-300/50 group-hover:text-indigo-300/80'
                                    }`} />
                                </div>
                                <div className="flex-1">
                                    <span className="block leading-tight">{item.label}</span>
                                    <span className={`text-[10px] transition-colors ${
                                        isActive ? 'text-indigo-300/60' : 'text-indigo-300/30'
                                    }`}>{item.desc}</span>
                                </div>
                                {isActive && (
                                    <ChevronRight className="w-4 h-4 text-indigo-400/60" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="relative px-5 py-5 border-t border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl avatar-gradient-1 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">A</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white/80">Admin</p>
                        <p className="text-[10px] text-indigo-300/40">v1.0.0</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
