'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'danger';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseClasses =
      'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]';

    // Variant classes
    const variantClasses: Record<ButtonVariant, string> = {
      primary: 'bg-forest-700 hover:bg-forest-800 text-white shadow-subtle',
      secondary: 'bg-sage-300 hover:bg-sage-400 text-ink-950 border border-sage-400/50',
      outline: 'border border-ink-200 bg-white hover:bg-ivory-100 text-ink-800 shadow-subtle',
      ghost: 'bg-transparent hover:bg-ink-100 text-ink-700 hover:text-ink-950',
      destructive: 'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-subtle',
      danger: 'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-subtle',
    };

    // Size classes
    const sizeClasses = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5',
      md: 'text-xs sm:text-sm px-4 py-2 gap-2',
      lg: 'text-sm sm:text-base px-5 py-2.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
