import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, FileText, MapPin, Shield, CloudRain } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const BottomNav = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/alerts', label: 'Alerts', icon: AlertTriangle },
    { to: '/forecasting', label: 'Forecast', icon: CloudRain, adminOnly: true },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/evacuation-centers', label: 'Evac', icon: MapPin },
  ].filter(item => !item.adminOnly || isAdmin);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#1e293b]/95 backdrop-blur-2xl border-t border-white/5 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.4)] overflow-hidden pb-safe">
      <div className="flex items-center justify-around h-[72px] px-2">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all duration-300 ${
                active ? 'text-brand-400' : 'text-white/30 hover:text-white'
              }`}
            >
              <div className={`w-12 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                active ? 'bg-brand-500/20 shadow-[0_0_15px_rgba(14,165,233,0.2)] border border-brand-500/20' : 'bg-transparent'
              }`}>
                <Icon className={`h-6 w-6 transition-transform ${active ? 'scale-110' : 'scale-100'}`} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-brand-400' : 'text-white/20'}`}>
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
