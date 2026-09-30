import React from 'react';

export interface BadgeProps {
  variant?: 'mint' | 'navy' | 'teal' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'mint',
  children,
  className = '',
}) => {
  const variantStyles = {
    mint: 'bg-mint-100 text-navy-900 border border-mint-400/40',
    navy: 'bg-navy-900 text-white',
    teal: 'bg-teal-500 text-white',
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-100 text-amber-900 border border-amber-200',
    danger: 'bg-red-100 text-red-800 border border-red-200',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold font-body tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
