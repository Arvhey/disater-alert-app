import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, LogOut, Settings, ChevronDown, Menu, Shield, RotateCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info('UPDATING TACTICAL DATA...', { 
      position: 'top-center', 
      autoClose: 1000, 
      hideProgressBar: true,
      theme: 'dark'
    });
    
    // Attempt to update service worker
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.update();
        }
      } catch (err) {
        console.error('SW Update failed:', err);
      }
    }

    // Add a slight delay for visual feedback
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  // Simulate barangay from metadata if available, else default to Poblacion for demo
  const location = user?.user_metadata?.barangay || 'Poblacion';

  return (
    <header className="h-16 sm:h-20 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sm:px-10 sticky top-0 z-[100] shadow-2xl">
      <div className="flex items-center gap-3">
        {/* Mobile menu removed since we use BottomNav */}

        {/* Mobile Logo (Visible only when Sidebar is hidden) */}
        <Link to="/dashboard" className="md:hidden flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-brand-500/20 transition-all">
            <img src="/vite.svg" alt="Logo" className="w-6 h-6 flex-shrink-0" />
          </div>
          <div>
            <h1 className="font-black text-white text-sm leading-tight tracking-tight uppercase">Polomolok</h1>
            <p className="text-[9px] font-black text-brand-400 tracking-[0.2em] uppercase">MDRRMO</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-brand-400 hover:bg-brand-500/10 hover:border-brand-500/30 transition-all active:scale-90"
          title="Refresh Tactical Feed"
        >
          <RotateCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin text-brand-400' : ''}`} />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => window.innerWidth < 1024 && setShowProfile(!showProfile)}
            className="flex items-center gap-4 px-3 py-2 rounded-2xl lg:hover:bg-white/5 transition-all cursor-default lg:cursor-default border border-transparent lg:border-white/5"
          >
            <div className="flex flex-col items-end hidden sm:block">
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <span className="bg-amber-500/20 text-amber-300 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-widest">
                    Admin
                  </span>
                )}
                <p className="text-sm font-black text-white tracking-tight">{displayName}</p>
              </div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">{location}</p>
            </div>
            <div className="w-11 h-11 rounded-full border-2 border-brand-500 text-brand-400 flex items-center justify-center bg-brand-500/10 shadow-[0_0_15px_rgba(14,165,233,0.2)]">
              <User className="h-6 w-6" />
            </div>
            <ChevronDown className={`h-4 w-4 text-white/20 transition-transform lg:hidden ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {showProfile && (
            <div className="lg:hidden">
              <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setShowProfile(false)} />
              <div className="absolute top-full right-0 mt-4 w-64 bg-[#1e293b]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] border border-white/10 overflow-hidden z-50">
                <div className="p-6 bg-white/5 border-b border-white/5">
                  <p className="text-base font-black text-white uppercase tracking-tight">{displayName}</p>
                  <p className="text-xs font-bold text-white/30 truncate mt-1">{user?.email}</p>
                </div>
                <div className="p-3">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-white/5 text-white/70 text-sm font-bold transition-all"
                  >
                    <Settings className="h-4 w-4 text-white/20" />
                    Settings
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-white/5 text-white/70 text-sm font-bold transition-all mt-1"
                    >
                      <Shield className="h-4 w-4 text-white/20" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-red-500/10 text-red-400 text-sm font-bold transition-all mt-2 border border-transparent hover:border-red-500/20"
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
