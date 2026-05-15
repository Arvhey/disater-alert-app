import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown, Menu, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  // Simulate barangay from metadata if available, else default to Poblacion for demo
  const location = user?.user_metadata?.barangay || 'Poblacion';

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-3">
        {/* Mobile menu removed since we use BottomNav */}

        {/* Mobile Logo (Visible only when Sidebar is hidden) */}
        <Link to="/dashboard" className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0284c7] rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-sm leading-tight">Polomolok</h1>
            <p className="text-[8px] font-bold text-[#0284c7] tracking-widest uppercase">Disaster System</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => window.innerWidth < 1024 && setShowProfile(!showProfile)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-xl lg:hover:bg-transparent transition-colors cursor-default lg:cursor-default"
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#0284c7] text-[#0284c7] flex items-center justify-center bg-sky-50">
              <User className="h-5 w-5" />
            </div>
            <div className="hidden sm:block text-right">
              <div className="flex items-center gap-2 justify-end">
                <p className="text-sm font-bold text-slate-800 leading-none">{displayName}</p>
                {isAdmin && (
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[11px] font-semibold text-slate-400 mt-1 pr-1">{location}</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform lg:hidden ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {showProfile && (
            <div className="lg:hidden">
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute top-full right-0 mt-2 w-56 bg-white shadow-xl rounded-2xl border border-slate-100 overflow-hidden z-50">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-800">{displayName}</p>
                  <p className="text-xs font-medium text-slate-500 truncate">{user?.email}</p>
                </div>
                <div className="p-2">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    Settings
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors mt-1"
                    >
                      <Shield className="h-4 w-4 text-slate-400" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 text-sm font-semibold transition-colors mt-1"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
