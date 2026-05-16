import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const PwaInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
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
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setShowInstall(false);
        }
        setDeferredPrompt(null);
      } else {
        alert("To install the app on your device, tap your browser's menu (⋮ or Share) and select 'Install App' or 'Add to Home Screen'.");
      }
    } catch (error) {
      console.error("PWA prompt failed", error);
      alert("To install the app on your device, tap your browser's menu (⋮ or Share) and select 'Install App' or 'Add to Home Screen'.");
    }
  };

  if (!showInstall) return null;

  return (
    <div className="md:hidden relative z-[999] bg-[#0f172a] text-white px-4 py-3 sm:px-6 flex items-center justify-between gap-3 shadow-xl border-b border-white/5">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-brand-500/20 border border-brand-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
          <img src="/vite.svg" className="w-6 h-6" alt="App Icon" />
        </div>
        <div className="min-w-0">
          <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider truncate">Disaster Alert</h3>
          <p className="text-[9px] sm:text-[10px] text-brand-400 font-bold uppercase tracking-widest truncate">Install App</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleInstallClick}
          className="bg-brand-500 text-white px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-brand-400 active:scale-95 transition-all shadow-lg flex items-center gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          Install
        </button>
        <button 
          onClick={() => setShowInstall(false)}
          className="p-1.5 text-white/40 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PwaInstallBanner;
