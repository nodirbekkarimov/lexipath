import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className = '',
}: {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={`border-b border-ivory-200 flex items-center space-x-1 sm:space-x-4 overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center space-x-2 py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
              isActive
                ? 'border-forest-700 text-forest-800 font-semibold'
                : 'border-transparent text-ink-500 hover:text-ink-900 hover:border-ivory-300'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-forest-100 text-forest-800 font-bold' : 'bg-ivory-200 text-ink-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className = '',
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
}) {
  return (
    <div className={`inline-flex p-1 bg-ivory-200/80 rounded-lg text-xs font-medium ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-md transition ${
            value === opt.value
              ? 'bg-white text-ink-950 font-semibold shadow-subtle'
              : 'text-ink-600 hover:text-ink-900'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
