import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] relative flex flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
