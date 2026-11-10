'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SpeakButton } from '@/components/ui/SpeakButton';
import { IELTS_PARAPHRASE_DB, lookupParaphrase, ParaphraseEntry } from '@/lib/dictionary/ielts-paraphraser';
import { Sparkles, Copy, Check, ArrowRight, BookOpen, Lightbulb } from 'lucide-react';

interface IeltsParaphraseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWord?: string;
}

const COMMON_WORDS = [
  'important',
  'increase',
  'decrease',
  'problem',
  'help',
  'show',
  'cause',
  'dangerous',
];

export function IeltsParaphraseModal({
  isOpen,
  onClose,
  initialWord = 'important',
}: IeltsParaphraseModalProps) {
  const [searchWord, setSearchWord] = useState(initialWord);
  const [currentEntry, setCurrentEntry] = useState<ParaphraseEntry | null>(
    lookupParaphrase(initialWord) || IELTS_PARAPHRASE_DB['important']
  );
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const handleSelectWord = (word: string) => {
    setSearchWord(word);
    const entry = lookupParaphrase(word);
    if (entry) {
      setCurrentEntry(entry);
    }
  };

  const handleCopyTemplate = (template: string) => {
    navigator.clipboard.writeText(template);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="IELTS Band 8.0+ Paraphrase & Collocation Booster"
      description="Writing va Speaking da oddiy takrorlanuvchi so'zlardan qoching — akademik C1/C2 muqobillari va tayyor shablonlar."
      size="xl"
    >
      <div className="space-y-5 pt-2">
        {/* Quick Word Chips */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#18231F]/70 block mb-2">
            Tezkor so'z tanlash
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_WORDS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => handleSelectWord(w)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors border ${
                  searchWord.toLowerCase() === w
                    ? 'bg-[#315C4A] text-white border-[#315C4A]'
                    : 'bg-[#F7F6F0] text-[#18231F]/80 border-[#18231F]/10 hover:bg-white'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Word Details */}
        {currentEntry && (
          <div className="space-y-4">
            {/* Header info */}
            <div className="p-3.5 bg-[#DCE9DF]/40 border border-[#315C4A]/20 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-[#18231F]/50 uppercase tracking-wider font-semibold">
                  Oddiy so'z:
                </span>
                <span className="ml-2 font-serif text-lg font-bold text-[#18231F]">
                  "{currentEntry.originalWord}"
                </span>
                <span className="text-xs text-[#18231F]/60 ml-2">
                  ({currentEntry.uzbekMeaning})
                </span>
              </div>
              <span className="text-xs font-bold text-[#315C4A] uppercase tracking-wider">
                Band 8.0+ muqobillari ↓
              </span>
            </div>

            {/* Alternatives Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentEntry.alternatives.map((alt) => (
                <div
                  key={alt.word}
                  className="p-4 bg-white border border-[#18231F]/10 rounded-xl shadow-2xs space-y-2 hover:border-[#315C4A]/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg font-bold text-[#18231F]">
                        {alt.word}
                      </span>
                      <SpeakButton text={alt.word} size="sm" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={alt.cefr === 'C2' ? 'terracotta' : 'primary'}
                        size="sm"
                      >
                        {alt.cefr}
                      </Badge>
                      <span className="text-[10px] font-bold text-[#315C4A] bg-[#DCE9DF] px-1.5 py-0.5 rounded">
                        Band {alt.band}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#18231F]/70 font-medium">
                    🇺🇿 {alt.nuanceUz}
                  </p>

                  <div className="pt-1.5 border-t border-[#18231F]/5">
                    <span className="text-[11px] font-bold text-[#315C4A] uppercase block mb-0.5">
                      Kollokatsiya:
                    </span>
                    <code className="text-xs font-mono bg-[#F7F6F0] px-2 py-0.5 rounded text-[#18231F]">
                      {alt.collocation}
                    </code>
                  </div>

                  <div className="pt-1">
                    <span className="text-[11px] text-[#18231F]/40 block mb-0.5">
                      IELTS insho misoli:
                    </span>
                    <p className="text-xs italic text-[#18231F]/80 bg-[#F7F6F0]/60 p-2 rounded-lg border border-[#18231F]/5">
                      "{alt.essayExample}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Writing Template Box */}
            <div className="p-4 bg-[#18231F] text-white rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#DCE9DF] flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-amber-400" /> IELTS Task 2 Tayyor Shablon
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyTemplate(currentEntry.ieltsWritingTemplate)}
                  className="text-xs flex items-center gap-1 text-[#DCE9DF] hover:text-white transition-colors"
                >
                  {copiedTemplate ? (
                    <>
                      <Check size={13} className="text-emerald-400" /> Nusxalandi!
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Nusxalash
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm font-serif italic text-white/90 leading-relaxed">
                "{currentEntry.ieltsWritingTemplate}"
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
