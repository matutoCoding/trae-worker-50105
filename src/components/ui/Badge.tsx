import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'custom';
  className?: string;
  customClass?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '', customClass }) => {
  const variantClasses: Record<string, string> = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-forest-50 text-forest-700 border-forest-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    custom: customClass || '',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
