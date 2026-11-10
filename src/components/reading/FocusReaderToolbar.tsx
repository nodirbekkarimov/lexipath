'use client';

import React from 'react';
import { Sun, Moon, BookOpen, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';

export type ReaderTheme = 'ivory' | 'sepia' | 'dark';

interface FocusReaderToolbarProps {
  theme: ReaderTheme;
  setTheme: (theme: ReaderTheme) => void;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  isFocusMode: boolean;
  setIsFocusMode: (val: boolean) => void;
}

export function FocusReaderToolbar({
  theme,
  setTheme,
  fontSize,
  setFontSize,
  isFocusMode,
  setIsFocusMode,
}: FocusReaderToolbarProps) {
  return (
    <div className="flex items-center justify-between p-2.5 bg-white/90 backdrop-blur border border-[#18231F]/10 rounded-xl shadow-xs text-xs">
      {/* Theme selector */}
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-semibold text-[#18231F]/50 uppercase tracking-wider mr-1">
          Rejim:
        </span>
        <button
          type="button"
          onClick={() => setTheme('ivory')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            theme === 'ivory'
              ? 'bg-[#315C4A] text-white'
              : 'bg-[#F7F6F0] text-[#18231F] hover:bg-ivory-200'
          }`}
        >
          Ivory
        </button>
        <button
          type="button"
          onClick={() => setTheme('sepia')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            theme === 'sepia'
              ? 'bg-[#8C6D46] text-white'
              : 'bg-[#FAF4EB] text-[#5C4830] hover:bg-[#F3EAD9]'
          }`}
        >
          Sepia
        </button>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-[#18231F] text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          Dark
        </button>
      </div>

      {/* Font sizing & Focus toggle */}
      <div className="flex items-center gap-2">
        <div className="flex items-center border border-[#18231F]/10 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setFontSize((prev) => Math.max(14, prev - 2))}
            className="px-2 py-1 bg-[#F7F6F0] hover:bg-white text-[#18231F] border-r border-[#18231F]/10"
            title="Shriftni kichraytirish"
          >
            <ZoomOut size={13} />
          </button>
          <span className="px-2 font-mono text-[11px] text-[#18231F]/70">
            {fontSize}px
          </span>
          <button
            type="button"
            onClick={() => setFontSize((prev) => Math.min(26, prev + 2))}
            className="px-2 py-1 bg-[#F7F6F0] hover:bg-white text-[#18231F]"
            title="Shriftni kattalashtirish"
          >
            <ZoomIn size={13} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsFocusMode(!isFocusMode)}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg font-medium border transition-colors ${
            isFocusMode
              ? 'bg-[#18231F] text-white border-[#18231F]'
              : 'bg-white text-[#18231F]/70 border-[#18231F]/15 hover:border-[#315C4A]'
          }`}
        >
          {isFocusMode ? (
            <>
              <Minimize2 size={13} /> Oddiy rejim
            </>
          ) : (
            <>
              <Maximize2 size={13} /> Focus rejim
            </>
          )}
        </button>
      </div>
    </div>
  );
}
