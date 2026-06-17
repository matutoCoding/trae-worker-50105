import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: { value: string; positive: boolean };
  color?: 'forest' | 'leaf' | 'earth' | 'sky' | 'amber' | 'purple';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  color = 'forest',
  className = '',
}) => {
  const colorClasses: Record<string, string> = {
    forest: 'from-forest-500 to-forest-700 text-forest-600 bg-forest-50',
    leaf: 'from-leaf-400 to-leaf-600 text-leaf-600 bg-leaf-400/10',
    earth: 'from-earth-400 to-earth-600 text-earth-600 bg-earth-400/10',
    sky: 'from-sky-400 to-sky-500 text-sky-600 bg-sky-50',
    amber: 'from-amber-400 to-amber-500 text-amber-600 bg-amber-50',
    purple: 'from-purple-400 to-purple-600 text-purple-600 bg-purple-50',
  };

  const [bgGradient, textColor, iconBg] = colorClasses[color].split(' text-').map(s => 'text-' + s);

  return (
    <div
      className={`relative p-5 rounded-2xl bg-white shadow-card border border-sand-100 hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group animate-fade-in-up ${className}`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${bgGradient} opacity-[0.08] rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-800 tracking-tight">{value}</p>
          {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bgGradient} flex items-center justify-center shadow-lg shadow-current/10`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {trend && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${trend.positive ? 'text-leaf-600' : 'text-red-500'}`}>
          <span>{trend.positive ? '↑' : '↓'}</span>
          <span>{trend.value}</span>
          <span className="text-gray-400 ml-1">较上月</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
