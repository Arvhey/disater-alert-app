import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// User Pages
import Dashboard from '../pages/user/Dashboard';
import Alerts from '../pages/user/Alerts';
import Reports from '../pages/user/Reports';
import EvacuationCenters from '../pages/user/EvacuationCenters';
import Hotlines from '../pages/user/Hotlines';
import Forecasting from '../pages/user/Forecasting';

// Admin Pages
import AdminPanel from '../pages/admin/AdminPanel';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Main Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/evacuation-centers" element={<EvacuationCenters />} />
        <Route path="/hotlines" element={<Hotlines />} />
        <Route path="/forecasting" element={<Forecasting />} />
        
        {/* Admin Only Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
