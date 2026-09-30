import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  borderAccent?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  borderAccent = false,
}) => {
  const hasCustomPadding = /\b(p|px|py|pt|pr|pb|pl)-\d+/.test(className) || className.includes('p-0');

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-slate-100/80 ${
        hasCustomPadding ? '' : 'p-6 md:p-8'
      } ${
        borderAccent ? 'border-t-4 border-t-teal-500' : ''
      } ${
        hoverEffect ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-teal-500/30' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
