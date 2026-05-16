import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import BottomNav from '../components/layout/BottomNav';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabase';
import { toast } from 'react-toastify';

const playAlertSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(440, ctx.currentTime + 0.2);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime + 0.3);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.warn("Audio not supported or blocked", e);
  }
};

const MainLayout = () => {
  const { isAdmin } = useAuth();

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Admin Watchdog & Admin Notifications
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('global-admin-alerts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports' }, (payload) => {
        playAlertSound();

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("🚨 NEW INTEL RECEIVED", {
            body: `${payload.new.type || 'Incident'} reported in ${payload.new.barangay}. Immediate review required.`,
            icon: "/vite.svg"
          });
        }

        toast.error(`NEW INTEL: ${payload.new.type || 'Incident'} in ${payload.new.barangay}`, {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          className: "border-2 border-red-500 bg-[#0f172a] text-white font-black tracking-widest uppercase shadow-[0_0_30px_rgba(239,68,68,0.5)]",
        });
      })
      .subscribe();

    const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
    silentAudio.loop = true;
    silentAudio.volume = 0.01;

    const startWatchdog = () => {
      silentAudio.play().catch(e => console.log("Watchdog waiting for interaction..."));
      document.removeEventListener('click', startWatchdog);
      document.removeEventListener('touchstart', startWatchdog);
    };

    document.addEventListener('click', startWatchdog);
    document.addEventListener('touchstart', startWatchdog);

    return () => {
      supabase.removeChannel(channel);
      silentAudio.pause();
      document.removeEventListener('click', startWatchdog);
      document.removeEventListener('touchstart', startWatchdog);
    };
  }, [isAdmin]);

  // Citizen / Global Alert Notifications
  useEffect(() => {
    const alertChannel = supabase
      .channel('global-citizen-alerts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts' }, (payload) => {
        playAlertSound();

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("⚠️ MDRRMO OFFICIAL ALERT", {
            body: payload.new.title,
            icon: "/vite.svg"
          });
        }

        toast.error(`MDRRMO ALERT: ${payload.new.title}`, {
          position: "top-center",
          autoClose: 15000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          className: "border-2 border-amber-500 bg-[#0f172a] text-white font-black tracking-widest uppercase shadow-[0_0_40px_rgba(245,158,11,0.6)]",
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(alertChannel);
    };
  }, []);

  return (
    <div className="w-full bg-[#0f172a] text-white flex lg:relative font-sans selection:bg-brand-500/30 min-h-screen lg:h-screen lg:overflow-hidden">
      {/* Background FX */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-400/5 blur-[120px]" />
      </div>

      {/* Sidebar — CSS-controlled, visible on lg+ */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative lg:pl-72 min-h-screen lg:h-screen">

        {/* Global Headers (Navbar) */}
        <div className="sticky top-0 z-[100] w-full bg-[#0f172a]">
          <Navbar />
        </div>

        {/* Scrollable Content Area */}
        <main className="flex-1 relative z-10 no-scrollbar scroll-smooth lg:overflow-y-auto lg:overflow-x-hidden">
          <div className="w-full lg:max-w-[1600px] lg:mx-auto px-4 lg:px-10 py-4 lg:py-10 pb-40 lg:pb-10">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom Nav — Strictly fixed to viewport using a Portal to body */}
      {typeof document !== 'undefined' && createPortal(
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[999]">
          <BottomNav />
        </div>,
        document.body
      )}
    </div>
  );
};

export default MainLayout;
