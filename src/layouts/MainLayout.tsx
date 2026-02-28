import React from 'react';
import { Outlet } from 'react-router-dom';
import DevTools from '@/components/DevTools';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F0F4C3] flex items-center justify-center font-sans text-gray-800">
      <div className="w-full max-w-md h-screen max-h-[900px] bg-white shadow-xl overflow-hidden relative flex flex-col">
        <DevTools />
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
