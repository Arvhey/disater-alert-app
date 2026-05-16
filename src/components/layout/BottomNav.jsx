import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, FileText, MapPin, Shield, CloudRain, Phone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const BottomNav = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navItems = [
    { to: '/alerts', label: 'Alerts', icon: AlertTriangle },
    { to: '/forecasting', label: 'Forecast', icon: CloudRain, adminOnly: true },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard, isMain: true },
    { to: '/evacuation-centers', label: 'Evac', icon: MapPin },
    { to: '/hotlines', label: 'Hotlines', icon: Phone },
    { to: '/admin', label: 'Admin', icon: Shield, adminOnly: true },
  ].filter(item => !item.adminOnly || isAdmin);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-[#1e293b]/80 backdrop-blur-2xl border-t border-white/10 rounded-t-[2rem] shadow-[0_-15px_40px_rgba(0,0,0,0.5)] overflow-visible pb-safe">
      <div className="flex items-center justify-between h-[72px] px-2 overflow-visible">
        {navItems.map(({ to, label, icon: Icon, isMain }) => {
          const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-300 relative ${
                active ? 'text-brand-400' : 'text-white/40 hover:text-white'
              }`}
            >
              <div className={`flex items-center justify-center transition-all duration-300 ${
                isMain 
                  ? 'absolute -top-4 w-12 h-12 rounded-2xl bg-brand-600 shadow-[0_10px_20px_rgba(14,165,233,0.4)] text-white border-4 border-[#0f172a]' 
                  : `w-9 h-8 sm:w-10 sm:h-8 rounded-xl ${active ? 'bg-brand-500/20 shadow-[0_0_15px_rgba(14,165,233,0.2)] border border-brand-500/20' : 'bg-transparent'}`
              }`}>
                <Icon className={`${isMain ? 'h-5 w-5' : 'h-4 w-4 sm:h-5 sm:w-5'} transition-transform ${active && !isMain ? 'scale-110' : 'scale-100'}`} />
              </div>
              <span className={`text-[7px] sm:text-[9px] font-black uppercase tracking-wider ${isMain ? 'mt-9' : ''} ${active ? 'text-brand-400' : 'text-white/30'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
