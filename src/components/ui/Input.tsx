import React from 'react';
import { Search, X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, hint, leftIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-ink-800">
            {label}
          </label>
        )}
        <div className="relative rounded-lg">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full text-xs sm:text-sm bg-ivory-50 border rounded-lg py-2 px-3 text-ink-950 placeholder:text-ink-400 transition focus:outline-none focus:ring-2 focus:ring-forest-700 focus:bg-white ${
              leftIcon ? 'pl-9' : ''
            } ${
              error ? 'border-terracotta-500 focus:ring-terracotta-500' : 'border-ivory-300 hover:border-ink-300'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] text-terracotta-600 font-medium">{error}</p>}
        {hint && !error && <p className="text-[11px] text-ink-500">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search vocabulary, Uzbek meaning, or tags...',
  className = '',
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-ivory-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700 text-ink-950 placeholder:text-ink-400 transition"
      />
      {value && (
        <button
          onClick={onClear}
          type="button"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-ink-400 hover:text-ink-700 rounded"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
