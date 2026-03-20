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
        <div className="flex min-h-screen bg-mesh">
            {/* Toast notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        borderRadius: '16px',
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(12px)',
                        color: '#f1f5f9',
                        fontSize: '13px',
                        fontWeight: '500',
                        padding: '12px 16px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.08)',
                    },
                    success: {
                        iconTheme: { primary: '#34d399', secondary: '#f1f5f9' },
                    },
                    error: {
                        iconTheme: { primary: '#fb7185', secondary: '#f1f5f9' },
                    },
                }}
            />

            {/* Desktop sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile header */}
                <MobileHeader />

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 max-w-[1400px] w-full mx-auto">
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
