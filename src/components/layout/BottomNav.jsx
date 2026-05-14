import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, FileText, MapPin, Phone, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const BottomNav = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/alerts', label: 'Alerts', icon: AlertTriangle },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/evacuation-centers', label: 'Centers', icon: MapPin },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: Shield }] : []),
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 pb-safe shadow-[0_-8px_20px_0_rgba(0,0,0,0.03)] rounded-t-[1.5rem]">
      <div className="flex items-center justify-around h-[4.5rem] px-2">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-300 ${
                active ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-2xl mb-1 transition-all duration-300
                ${active ? 'bg-brand-50 shadow-sm shadow-brand-100/50 scale-110' : 'bg-transparent'}
              `}>
                <Icon className={`h-[1.35rem] w-[1.35rem] transition-transform ${active ? 'animate-in zoom-in-75 duration-300' : ''}`} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tighter transition-all ${active ? 'opacity-100' : 'opacity-60'}`}>
                {label}
              </span>
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
