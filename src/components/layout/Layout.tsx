import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useStore } from '@/store';

const Layout: React.FC = () => {
  const { sidebarCollapsed } = useStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-forest-50/30 to-sand-100">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-leaf-400/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-forest-400/5 rounded-full blur-3xl translate-y-1/3" />
      </div>

      <Sidebar />

      <div
        className={`min-h-screen transition-all duration-300 relative ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Header />
        <main className="p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
