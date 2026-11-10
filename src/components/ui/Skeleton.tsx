import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  }[variant];

  return (
    <div
      className={`animate-pulse bg-ivory-300/80 ${variantStyles} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}
