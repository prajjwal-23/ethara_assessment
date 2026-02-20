/**
 * Main application component.
 * Sets up routing, layout (sidebar + content area), and toast notifications.
 */

import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import DashboardPage from './pages/DashboardPage';
import EmployeeListPage from './pages/EmployeeListPage';
import AddEmployeePage from './pages/AddEmployeePage';
import AttendancePage from './pages/AttendancePage';

export default function App() {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Toast notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        borderRadius: '12px',
                        background: '#1e293b',
                        color: '#f1f5f9',
                        fontSize: '14px',
                        fontWeight: '500',
                    },
                    success: {
                        iconTheme: { primary: '#10b981', secondary: '#f1f5f9' },
                    },
                    error: {
                        iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' },
                    },
                }}
            />

            {/* Desktop sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Mobile header */}
                <MobileHeader />

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/employees" element={<EmployeeListPage />} />
                        <Route path="/employees/add" element={<AddEmployeePage />} />
                        <Route path="/attendance" element={<AttendancePage />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}
