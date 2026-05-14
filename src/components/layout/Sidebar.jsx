import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, AlertTriangle, FileText, MapPin,
  Shield, LogOut, X, Bell, User, Phone
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../services/authService';
import { toast } from 'react-toastify';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { to: '/reports', label: 'My Reports', icon: FileText },
  { to: '/evacuation-centers', label: 'Evacuation Centers', icon: MapPin },
  { to: '/hotlines', label: 'Emergency Hotlines', icon: Phone },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const barangay = user?.user_metadata?.barangay;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <aside className="hidden lg:flex flex-col w-72 h-full bg-white border-r border-slate-100 sticky top-16 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 pb-3">
          Navigation
        </p>
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 ${
                active
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-100 translate-x-1'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 flex-shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
              {label}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 pb-3 pt-8">
              Administration
            </p>
            <Link
              to="/admin"
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 ${
                location.pathname === '/admin'
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 translate-x-1'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent hover:border-slate-200'
              }`}
            >
              <Shield className={`h-4.5 w-4.5 flex-shrink-0 ${location.pathname === '/admin' ? 'text-white' : 'text-slate-400'}`} />
              Admin Panel
            </Link>
          </>
        )}
      </nav>

      {/* Sign out */}
      <div className="px-4 py-6 border-t border-slate-100">
        <button
          onClick={handleSignOut}
          className="w-full group flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
            <LogOut className="h-4.5 w-4.5 flex-shrink-0 text-slate-400 group-hover:text-red-600" />
          </div>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
