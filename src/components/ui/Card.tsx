import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  extra?: React.ReactNode;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  icon,
  extra,
  hoverable = false,
}) => {
  return (
    <div
      className={`
        rounded-2xl bg-white border border-sand-100 shadow-card overflow-hidden
        ${hoverable ? 'hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
    >
      {(title || extra) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-sand-100 bg-gradient-to-r from-sand-50/50 to-transparent">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-forest-100 to-leaf-400/20 flex items-center justify-center text-forest-600">
                {icon}
              </div>
            )}
            <div>
              {title && <h3 className="font-serif font-bold text-lg text-forest-800 leading-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {extra}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};

export default Card;
