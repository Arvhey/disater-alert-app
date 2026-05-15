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
    <aside className="w-72 bg-[#0f172a]/60 backdrop-blur-2xl border-r border-white/5 h-screen fixed left-0 top-0 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.3)] z-[101]">
      {/* Logo */}
      <div className="h-24 flex items-center px-8 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-2xl">
            <img src="/vite.svg" alt="Logo" className="w-7 h-7 flex-shrink-0" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-white text-base leading-tight tracking-tighter uppercase">Polomolok</h1>
            <p className="text-[10px] font-black text-brand-400 tracking-[0.2em] uppercase mt-0.5 whitespace-nowrap opacity-80">MDRRMO System</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 py-8 overflow-y-auto no-scrollbar">
        <div className="px-8 mb-4">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Core Navigation</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-sm font-bold transition-all duration-300 group ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-[0_10px_20px_rgba(14,165,233,0.3)] border border-brand-400/50'
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-white/20 group-hover:text-brand-400'}`} />
                <span className="tracking-tight">{item.label}</span>
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="px-5 mt-10 mb-4">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Strategic Control</p>
              </div>
              <Link
                to="/admin"
                className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-sm font-bold transition-all duration-300 group ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-brand-500 text-white shadow-[0_10px_20px_rgba(14,165,233,0.3)] border border-brand-400/50'
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Shield className={`h-5 w-5 transition-colors ${location.pathname.startsWith('/admin') ? 'text-white' : 'text-white/20 group-hover:text-brand-400'}`} />
                <span className="tracking-tight">Admin Panel</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Bottom Sign Out */}
      <div className="p-6 mt-auto border-t border-white/5 bg-white/5">
        <button
          onClick={signOut}
          className="flex items-center gap-4 px-5 py-4 w-full rounded-[1.25rem] text-sm font-bold text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/20 group"
        >
          <LogOut className="h-5 w-5 text-white/20 group-hover:text-red-400 transition-colors" />
          <span className="tracking-tight">Sign Out Ops</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
