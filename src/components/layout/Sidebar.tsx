import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOpen, Sprout, Scissors, Bug, Truck, Users, Search, Leaf, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useStore } from '@/store';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  key: string;
}

const navItems: NavItem[] = [
  { path: '/ledger', label: '苗木台账', icon: BookOpen, key: 'ledger' },
  { path: '/seedling', label: '育苗管理', icon: Sprout, key: 'seedling' },
  { path: '/grafting', label: '嫁接记录', icon: Scissors, key: 'grafting' },
  { path: '/pest', label: '病虫防治', icon: Bug, key: 'pest' },
  { path: '/sales', label: '出圃销售', icon: Truck, key: 'sales' },
  { path: '/customer', label: '客户管理', icon: Users, key: 'customer' },
  { path: '/trace', label: '溯源查询', icon: Search, key: 'trace' },
];

const Sidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed, setCurrentPage } = useStore();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-forest-800 via-forest-700 to-forest-800 text-white shadow-xl transition-all duration-300 z-40 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-forest-600/50">
        <div className={`flex items-center gap-3 overflow-hidden ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-leaf-400 to-forest-500 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="animate-fade-in">
              <div className="font-serif font-bold text-lg leading-tight">珍杉苗圃</div>
              <div className="text-xs text-forest-200/80 leading-tight">珍稀苗木管理系统</div>
            </div>
          )}
        </div>
      </div>

      <nav className="py-4 px-3 space-y-1">
        {navItems.map((item, idx) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setCurrentPage(item.key)}
            className={({ isActive }) => `
              group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 animate-fade-in-up
              ${isActive
                ? 'bg-gradient-to-r from-leaf-500 to-forest-500 text-white shadow-lg shadow-forest-900/30'
                : 'text-forest-100/80 hover:bg-forest-600/40 hover:text-white'
              }
            `}
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${sidebarCollapsed ? 'mx-auto' : 'group-hover:scale-110'}`} />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-forest-700 hover:bg-forest-50 transition-colors z-50 border border-forest-100"
      >
        {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {!sidebarCollapsed && (
        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-forest-900/50 backdrop-blur border border-forest-600/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-leaf-400 to-earth-500 flex items-center justify-center text-sm font-bold">管</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">苗圃管理员</div>
              <div className="text-xs text-forest-200/70 truncate">admin@nursery.cn</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
