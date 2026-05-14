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
    if (deferredPrompt) {
      // Show the native install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstall(false);
      }
      setDeferredPrompt(null);
      // Fallback instruction for browsers where prompt isn't natively triggerable
      alert("To install the app on your device, tap your browser's menu (⋮ or Share) and select 'Install App'.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col">
      {/* PWA Install Banner - Only visible on mobile */}
      {showInstall && (
        <div className="md:hidden bg-[#0f172a] text-white px-4 py-3 flex items-center justify-between shadow-md z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0284c7] rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Install Polomolok App</p>
              <p className="text-[10px] text-slate-300 font-medium">Get the official mobile app for real-time alerts</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleInstallClick}
              className="bg-[#0284c7] hover:bg-sky-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Install
            </button>
            <button onClick={() => setShowInstall(false)} className="p-1 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
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
