import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export function Card({
  className = '',
  padding = 'md',
  hoverEffect = false,
  children,
  ...props
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`bg-white rounded-xl border border-ivory-200/80 shadow-card transition-all ${
        hoverEffect ? 'hover:border-ink-300 hover:shadow-elevated' : ''
      } ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = '',
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ivory-200/80 pb-4 mb-4 ${className}`}>
      <div>
        <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-950">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-ink-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
