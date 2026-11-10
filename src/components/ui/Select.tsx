import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, options, error, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-ink-800">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full text-xs sm:text-sm bg-white border border-ivory-300 rounded-lg py-2 px-3 text-ink-950 transition focus:outline-none focus:ring-2 focus:ring-forest-700 ${
            error ? 'border-terracotta-500' : 'hover:border-ink-300'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-[11px] text-terracotta-600 font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
