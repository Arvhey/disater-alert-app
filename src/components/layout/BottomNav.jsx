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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                active ? 'text-brand-600' : 'text-slate-500'
              }`}
            >
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-xl transition-all
                ${active ? 'bg-brand-50' : 'bg-transparent'}
              `}>
                <Icon className={`h-5 w-5 ${active ? 'scale-110' : ''}`} />
              </div>
              <span className={`text-[10px] font-bold mt-0.5 ${active ? 'opacity-100' : 'opacity-70'}`}>
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
