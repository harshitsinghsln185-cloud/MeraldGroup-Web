import React from 'react';

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  color?: 'navy' | 'white' | 'teal' | 'neutral';
  align?: 'left' | 'center' | 'right';
  id?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 1,
  children,
  className = '',
  color = 'navy',
  align = 'left',
  id,
}) => {
  const Tag = `h${level}` as React.ElementType;

  const colorStyles: Record<string, string> = {
    navy: 'text-navy-900',
    white: 'text-white',
    teal: 'text-teal-500',
    neutral: 'text-neutral-900',
  };

  const alignStyles: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // Precise font scales with explicit line-height and bottom space to avoid any overlaps
  const sizeStyles: Record<number, string> = {
    1: 'text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight block mb-3',
    2: 'text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight block mb-3',
    3: 'text-xl sm:text-2xl font-bold leading-snug block mb-2',
    4: 'text-lg sm:text-xl font-semibold leading-snug block mb-2',
    5: 'text-base font-semibold leading-normal block mb-1',
    6: 'text-xs sm:text-sm font-semibold uppercase tracking-wider block mb-1',
  };

  return (
    <Tag
      id={id}
      className={`font-heading ${sizeStyles[level]} ${colorStyles[color]} ${alignStyles[align]} ${className}`}
    >
      {children}
    </Tag>
  );
};

export interface TextProps {
  size?: 'large' | 'regular' | 'small';
  children: React.ReactNode;
  className?: string;
  color?: 'primary' | 'muted' | 'white' | 'teal' | 'navy';
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold';
}

export const Text: React.FC<TextProps> = ({
  size = 'regular',
  children,
  className = '',
  color = 'primary',
  align = 'left',
  weight = 'normal',
}) => {
  const colorStyles: Record<string, string> = {
    primary: 'text-neutral-900',
    muted: 'text-neutral-500',
    white: 'text-white',
    teal: 'text-teal-500',
    navy: 'text-navy-900',
  };

  const alignStyles: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const sizeStyles: Record<string, string> = {
    large: 'text-base sm:text-lg leading-relaxed',
    regular: 'text-sm sm:text-base leading-relaxed',
    small: 'text-xs sm:text-sm leading-normal',
  };

  const weightStyles: Record<string, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
  };

  return (
    <p
      className={`font-body ${sizeStyles[size]} ${colorStyles[color]} ${weightStyles[weight]} ${alignStyles[align]} ${className}`}
    >
      {children}
    </p>
  );
};

export interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  className = '',
  required = false,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block font-body text-xs sm:text-sm font-medium text-navy-900 mb-1.5 ${className}`}
    >
      {children}
      {required && <span className="text-[#D64545] ml-1">*</span>}
    </label>
  );
};
