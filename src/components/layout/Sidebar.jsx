import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, FileText, MapPin, Phone, Shield, LogOut, Bell, CloudRain } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { isAdmin, signOut } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
    { icon: FileText, label: 'My Reports', path: '/reports' },
    { icon: CloudRain, label: 'Forecasting', path: '/forecasting', adminOnly: true },
    { icon: MapPin, label: 'Evacuation Centers', path: '/evacuation-centers' },
    { icon: Phone, label: 'Emergency Hotlines', path: '/hotlines' },
  ].filter(item => !item.adminOnly || isAdmin);

  return (
    <aside className="w-64 bg-white border-r border-slate-100 min-h-screen fixed left-0 top-0 z-50 hidden md:flex flex-col">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img src="/vite.svg" alt="Logo" className="w-10 h-10 rounded-lg shadow-sm flex-shrink-0" />
          <div className="flex flex-col">
            <h1 className="font-black text-slate-800 text-sm leading-tight tracking-tight uppercase">Polomolok</h1>
            <p className="text-[9px] font-black text-[#0284c7] tracking-widest uppercase mt-0.5 whitespace-nowrap">MDRRMO System</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 py-6 overflow-y-auto">
        <div className="px-6 mb-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigation</p>
        </div>
        
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0284c7] text-white shadow-md shadow-sky-200'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="px-3 mt-8 mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administration</p>
              </div>
              <Link
                to="/admin"
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-[#0284c7] text-white shadow-md shadow-sky-200'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Shield className={`h-5 w-5 ${location.pathname.startsWith('/admin') ? 'text-white' : 'text-slate-400'}`} />
                <span>Admin Panel</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Bottom Sign Out */}
      <div className="p-4 mt-auto">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 text-slate-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
