import React from 'react';
import { Label } from './Typography';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, required, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full mb-4">
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-2.5 bg-white border ${
            error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 hover:border-slate-300'
          } rounded-lg text-sm text-neutral-900 placeholder-neutral-400 font-body focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-xs ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600 font-body font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-neutral-500 font-body">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
