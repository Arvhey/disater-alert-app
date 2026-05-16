import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const AuthLayout = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(true);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setShowInstall(false);
    }

    window.addEventListener('appinstalled', () => {
      setShowInstall(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    try {
      if (deferredPrompt) {
        // Show the native install prompt
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setShowInstall(false);
        }
        setDeferredPrompt(null);
      } else {
        // Fallback instruction for browsers where prompt isn't natively triggerable
        alert("To install the app on your device, tap your browser's menu (⋮ or Share) and select 'Install App'.");
      }
    } catch (error) {
      console.error("PWA prompt failed", error);
      alert("To install the app on your device, tap your browser's menu (⋮ or Share) and select 'Install App'.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative flex flex-col">
      {/* PWA Install Banner - Only visible on mobile */}
      {showInstall && (
        <div className="md:hidden relative z-50 bg-[#0f172a] text-white px-4 py-3 sm:px-6 flex items-center justify-between gap-3 shadow-xl border-b border-white/5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-brand-500/20 border border-brand-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-brand-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight truncate">Install Polomolok App</p>
              <p className="text-[10px] text-slate-300 font-medium line-clamp-1 opacity-80">Get the official mobile app</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button 
              onClick={handleInstallClick}
              className="bg-brand-500 hover:bg-brand-600 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-500/30 active:scale-95 animate-pulse-glow"
            >
              Install
            </button>
          </div>
        </div>
      )}

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
