import React from 'react';

interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeKey, onChange, className = '' }) => {
  return (
    <div className={`inline-flex p-1 rounded-xl bg-sand-50 border border-sand-200 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`
              relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              flex items-center gap-2
              ${isActive
                ? 'bg-white text-forest-700 shadow-soft'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }
            `}
          >
            {tab.icon && <span className={isActive ? 'text-forest-600' : ''}>{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-forest-100 text-forest-700' : 'bg-gray-200 text-gray-600'}`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
