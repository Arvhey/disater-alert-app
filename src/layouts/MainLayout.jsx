import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import BottomNav from '../components/layout/BottomNav';

const MainLayout = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen w-full bg-[#0f172a] text-white flex overflow-hidden relative font-sans selection:bg-brand-500/30">
      {/* Background FX */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-400/5 blur-[120px]" />
      </div>

      {/* Sidebar - Locked to Left */}
      {isDesktop && <Sidebar />}

      {/* Main Framework */}
      <div className={`flex-1 flex flex-col min-w-0 h-full relative transition-all duration-300 ${isDesktop ? 'md:pl-72' : 'pl-0'}`}>
        {/* Persistent Top Nav */}
        <Navbar />

        {/* Scrollable Intelligence Area */}
        <main className="flex-1 overflow-y-auto relative z-10 no-scrollbar sm:custom-scrollbar">
          <div className="w-full md:max-w-[1600px] md:mx-auto px-4 sm:px-10 py-4 sm:py-10 pb-32 md:pb-10">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Ops Nav */}
        {!isDesktop && <BottomNav />}
      </div>

    </div>
  );
};

export default MainLayout;
