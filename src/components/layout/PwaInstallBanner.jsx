import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

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
    <div className="md:hidden relative z-[999] bg-[#1e293b]/95 backdrop-blur-2xl text-white px-4 py-4 sm:px-6 flex items-center justify-between gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.4)] border-b border-white/10">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-brand-500/20 border border-brand-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
          <img src="/vite.svg" className="w-6 h-6" alt="App Icon" />
        </div>
        <div className="min-w-0">
          <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider truncate">Disaster Alert</h3>
          <p className="text-[9px] sm:text-[10px] text-brand-400 font-bold uppercase tracking-widest truncate">Install App</p>
        </div>
      </div>
      <div className="flex-shrink-0">
        <button
          onClick={handleInstallClick}
          className="bg-gradient-to-r from-brand-600 to-brand-400 text-white px-5 py-2.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] active:scale-95 transition-all shadow-xl flex items-center gap-2 border border-brand-400/50"
        >
          <Download className="h-4 w-4" />
          INSTALL APP
        </button>
      </div>
    </div>
  );
};

export default PwaInstallBanner;
