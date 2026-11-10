import React from 'react';
import { Button } from './Button';

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryAction,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryAction?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-ivory-300 bg-white/60 space-y-3">
      <div className="w-12 h-12 rounded-full bg-ivory-100 text-forest-700 flex items-center justify-center mx-auto border border-ivory-200">
        {icon}
      </div>
      <h4 className="font-serif text-lg font-bold text-ink-950">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-ink-500 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {(actionLabel || secondaryAction) && (
        <div className="flex items-center justify-center space-x-3 pt-2">
          {actionLabel && onAction && (
            <Button size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
