import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../services/authService';
import { toast } from 'react-toastify';

const Navbar = ({ onMenuClick }) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        {/* Left: brand */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-md shadow-brand-200">
              <Bell className="h-4.5 w-4.5 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-black text-slate-900 leading-none tracking-tight">Polomolok</p>
              <p className="text-[9px] font-bold text-brand-600 uppercase tracking-widest leading-none mt-1">Disaster System</p>
            </div>
          </Link>
        </div>

        {/* Right: profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-100/80 transition-all border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center border border-brand-100">
              <User className="h-4.5 w-4.5 text-brand-700" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">{displayName}</p>
              <p className="text-[10px] font-medium text-slate-400 leading-none mt-1">{user?.user_metadata?.barangay || 'User'}</p>
            </div>
            {isAdmin && (
              <span className="hidden sm:block text-[10px] font-semibold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full ml-1">
                Admin
              </span>
            )}
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-20 py-1">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex lg:hidden items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
