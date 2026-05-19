import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import POSPage from './pages/POSPage';
import SalesPage from './pages/SalesPage';
import EmployeesPage from './pages/EmployeesPage';
import CustomersPage from './pages/CustomersPage';
import SuppliersPage from './pages/SuppliersPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LicenseActivationPage from './pages/LicenseActivationPage';

function App() {
  const { token, user } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        {!token ? (
          <>
            <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
            <Route path="/activate-license" element={<AuthLayout><LicenseActivationPage /></AuthLayout>} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            {/* Main Routes */}
            <Route path="/" element={<MainLayout><DashboardPage /></MainLayout>} />
            <Route path="/inventory" element={<MainLayout><InventoryPage /></MainLayout>} />
            <Route path="/pos" element={<MainLayout><POSPage /></MainLayout>} />
            <Route path="/sales" element={<MainLayout><SalesPage /></MainLayout>} />
            
            {/* Manager & Admin Routes */}
            {['manager', 'super_admin'].includes(user?.role) && (
              <>
                <Route path="/employees" element={<MainLayout><EmployeesPage /></MainLayout>} />
                <Route path="/customers" element={<MainLayout><CustomersPage /></MainLayout>} />
                <Route path="/suppliers" element={<MainLayout><SuppliersPage /></MainLayout>} />
                <Route path="/reports" element={<MainLayout><ReportsPage /></MainLayout>} />
              </>
            )}
            
            {/* Admin Only Routes */}
            {user?.role === 'super_admin' && (
              <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
            )}
            
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
