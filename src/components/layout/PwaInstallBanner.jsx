import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const PwaInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show banner after 5 seconds if not already installed (Force visibility for iOS/Manual)
    const timer = setTimeout(() => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      if (!isStandalone) {
        setShowInstall(true);
      }
    }, 5000);

    window.addEventListener('appinstalled', () => {
      setShowInstall(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setShowInstall(false);
        }
        setDeferredPrompt(null);
      } catch (error) {
        console.error("PWA prompt failed", error);
      }
    } else if (isIOS) {
      alert("ON IPHONE: Tap the 'Share' icon (bottom center) and select 'Add to Home Screen' to install.");
    } else {
      alert("TO INSTALL: Tap the browser menu (⋮) and select 'Install App' or 'Add to Home Screen'.");
    }
  };

  if (!showInstall) return null;

  return (
    <div className="lg:hidden relative z-[999] bg-[#1e293b]/95 backdrop-blur-3xl text-white px-4 py-4 flex items-center justify-between gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.6)] border-b border-white/10 animate-in slide-in-from-top duration-700">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-brand-500/20 border border-brand-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
          <img src="/vite.svg" className="w-6 h-6" alt="App Icon" />
        </div>
        <div className="min-w-0">
          <h3 className="font-black text-[11px] uppercase tracking-wider truncate">Tactical Mobile Ops</h3>
          <p className="text-[9px] text-brand-400 font-bold uppercase tracking-widest truncate">Ready for Installation</p>
        </div>
      </div>
      <div className="flex-shrink-0">
        <button
          onClick={handleInstallClick}
          className="bg-brand-500 hover:bg-brand-400 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] flex items-center gap-2 border border-brand-400/30"
        >
          <Download className="h-4 w-4" />
          INSTALL
        </button>
      </div>
    </div>
  );
};

export default PwaInstallBanner;
