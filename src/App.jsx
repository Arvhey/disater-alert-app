import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Hotlines from './pages/user/Hotlines';
import AuthLayout from './layouts/AuthLayout';
import Reports from './pages/user/Reports';
import EvacuationCenters from './pages/user/EvacuationCenters';
import AdminPanel from './pages/admin/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
