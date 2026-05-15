import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import BottomNav from '../components/layout/BottomNav';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar - visible on md+ */}
      <Sidebar />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen min-w-0">
        {/* Top Navbar - Fixed at top */}
        <div className="sticky top-0 z-50 bg-white">
          <Navbar />
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mx-auto px-4 sm:px-8 py-8 pb-24 md:pb-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default MainLayout;
