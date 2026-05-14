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
        <ToastContainer 
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName={() => 
            "relative flex p-3 min-h-12 rounded-2xl justify-between overflow-hidden cursor-pointer bg-white shadow-xl shadow-slate-200 border border-slate-100 mb-4 mx-4 sm:mx-0"
          }
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
