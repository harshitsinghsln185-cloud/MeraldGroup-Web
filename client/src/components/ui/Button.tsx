import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-body font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs active:scale-[0.98]';

  const variantStyles = {
    primary: 'bg-navy-700 text-white hover:bg-navy-900 focus:ring-navy-700 shadow-md',
    secondary: 'bg-teal-500 text-white hover:bg-blue-600 focus:ring-teal-500 shadow-md',
    outline: 'border-2 border-navy-700 text-navy-700 hover:bg-mint-100 focus:ring-navy-700',
    gradient: 'bg-gradient-to-r from-navy-900 via-blue-600 to-teal-500 text-white hover:opacity-95 hover:shadow-lg focus:ring-teal-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-sm',
  };

  const sizeStyles = {
    sm: 'px-3.5 py-2 text-xs md:text-sm',
    md: 'px-5 py-2.5 text-sm md:text-base',
    lg: 'px-7 py-3.5 text-base md:text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
