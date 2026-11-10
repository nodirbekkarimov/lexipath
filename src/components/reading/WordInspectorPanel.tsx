'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SpeakButton } from '@/components/ui/SpeakButton';
import { Bookmark, Check, Sparkles, X, ArrowRight, Loader2, Lightbulb } from 'lucide-react';
import { VocabularyItem, CEFRLevel, PartOfSpeech } from '@/types/database';
import { useLexiPathStore } from '@/lib/data-store';
import { getMnemonicForWord } from '@/lib/dictionary/mnemonics-db';
import Link from 'next/link';

interface WordInspectorPanelProps {
  selectedWord: string | null;
  vocabItem?: VocabularyItem;
  contextSentence: string;
  isSaved: boolean;
  onSaveToVault: (collectionName: string) => void;
  onClose: () => void;
}

export function WordInspectorPanel({
  selectedWord,
  vocabItem,
  contextSentence,
  isSaved,
  onSaveToVault,
  onClose,
}: WordInspectorPanelProps) {
  const store = useLexiPathStore();
  const [selectedCollection, setSelectedCollection] = useState('Reading Vault');
  const [justSaved, setJustSaved] = useState(false);

  // Dynamic enrichment state
  const [loading, setLoading] = useState(false);
  const [enrichedData, setEnrichedData] = useState<{
    cefrLevel: CEFRLevel;
    ieltsBand: number;
    partOfSpeech: PartOfSpeech;
    phoneticIpa: string;
    audioUrl?: string;
    translationUz: string;
    definitionEn: string;
    collocations?: string[];
  } | null>(null);

  useEffect(() => {
    if (!selectedWord) {
      setEnrichedData(null);
      return;
    }

    // If already in target vocab, use its data
    if (vocabItem) {
      setEnrichedData({
        cefrLevel: vocabItem.cefrLevel || 'C1',
        ieltsBand: vocabItem.ieltsBand || 7.5,
        partOfSpeech: (vocabItem.partOfSpeech || 'noun') as PartOfSpeech,
        phoneticIpa: vocabItem.pronunciationIpa || `/${selectedWord}/`,
        translationUz: vocabItem.translationUz || `${selectedWord} ma'nosi`,
        definitionEn: vocabItem.definitionEn || '',
        collocations: vocabItem.collocations || [],
      });
      return;
    }

    // Otherwise, auto-enrich via API
    let isCancelled = false;
    setLoading(true);

    fetch('/api/ai/enrich-word', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: selectedWord, context: contextSentence }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!isCancelled && res.data) {
          setEnrichedData({
            cefrLevel: res.data.cefrLevel || 'C1',
            ieltsBand: res.data.ieltsBand || 7.5,
            partOfSpeech: res.data.partOfSpeech || 'noun',
            phoneticIpa: res.data.phoneticIpa || `/${selectedWord}/`,
            audioUrl: res.data.audioUrl,
            translationUz: res.data.translationUz || `${selectedWord} ma'nosi`,
            definitionEn: res.data.definitionEn || '',
            collocations: res.data.collocations || [],
          });
        }
      })
      .catch(() => {
        // Fallback
        if (!isCancelled) {
          setEnrichedData({
            cefrLevel: 'C1',
            ieltsBand: 7.5,
            partOfSpeech: 'noun',
            phoneticIpa: `/${selectedWord}/`,
            translationUz: `${selectedWord} ma'nosi`,
            definitionEn: `Academic vocabulary term in context.`,
          });
        }
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedWord, vocabItem, contextSentence]);

  if (!selectedWord) return null;

  const lemma = vocabItem?.lemma || selectedWord;
  const ipa = enrichedData?.phoneticIpa || vocabItem?.pronunciationIpa || `/${selectedWord.toLowerCase()}/`;
  const pos = enrichedData?.partOfSpeech || vocabItem?.partOfSpeech || 'academic lexis';
  const cefr = enrichedData?.cefrLevel || vocabItem?.cefrLevel || 'C1';
  const def = enrichedData?.definitionEn || vocabItem?.definitionEn || `Academic vocabulary term encountered in reading passage.`;
  const uzTranslation = enrichedData?.translationUz || vocabItem?.translationUz || `O'quv matnidagi akademik so'z`;

  const handleSave = () => {
    if (vocabItem) {
      onSaveToVault(selectedCollection);
    } else {
      // Add newly enriched word to store
      store.addWord(
        {
          lemma,
          partOfSpeech: pos as PartOfSpeech,
          cefrLevel: cefr as CEFRLevel,
          definitionEn: def,
          translationUz: uzTranslation,
          pronunciationIpa: ipa,
          contextSentence: contextSentence,
          ieltsTopic: 'Reading Passage',
        },
        contextSentence,
        selectedCollection
      );
    }
    setJustSaved(true);
  };

  return (
    <div className="sticky top-20 bg-white border border-[#315C4A]/25 rounded-2xl p-5 shadow-lg animate-in slide-in-from-right-4 duration-200 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#18231F]/8 pb-3">
        <div className="flex items-center space-x-1.5 text-[#315C4A]">
          <Sparkles className="w-4 h-4 text-[#315C4A]" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#315C4A]">
            Contextual Lexis Inspector
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-[#18231F]/40 hover:text-[#18231F] p-1 rounded-md transition"
          aria-label="Close inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Word Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <h4 className="font-serif text-2xl font-bold text-[#18231F]">
              {lemma}
            </h4>
            <SpeakButton text={lemma} audioUrl={enrichedData?.audioUrl} size="sm" />
          </div>
          <Badge variant="primary" size="sm">
            {cefr}
          </Badge>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#18231F]/50 mt-1">
          <span>{ipa}</span>
          <span>•</span>
          <span className="italic capitalize">{pos}</span>
        </div>
      </div>

      {loading ? (
        <div className="py-6 flex flex-col items-center justify-center space-y-2 text-[#315C4A]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-xs font-medium">Lug'at tahlil qilinmoqda...</span>
        </div>
      ) : (
        <>
          {/* Uzbek Translation Box */}
          <div className="bg-[#DCE9DF]/50 border border-[#315C4A]/20 rounded-xl p-3.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#315C4A] font-bold block mb-1">
              🇺🇿 O'zbekcha Tarjimasi
            </span>
            <p className="text-sm font-semibold text-[#18231F] leading-snug">
              {uzTranslation}
            </p>
          </div>

          {/* Mnemonics Association Box if available */}
          {(() => {
            const mnemonic = getMnemonicForWord(lemma);
            if (!mnemonic) return null;
            return (
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                  <Lightbulb size={13} className="text-amber-600" />
                  <span>Eslab Qolish Kaliti (Mnemonika)</span>
                </div>
                <p className="text-xs font-bold text-amber-950">
                  💡 {mnemonic.hookUz}
                </p>
                <p className="text-[11px] text-amber-900/80 leading-relaxed italic">
                  {mnemonic.storyUz}
                </p>
              </div>
            );
          })()}

          {/* English Definition */}
          {def && (
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#18231F]/40 block">
                Akademik Ta'rifi
              </span>
              <p className="text-xs text-[#18231F]/80 leading-relaxed bg-[#F7F6F0] p-2.5 rounded-lg border border-[#18231F]/6">
                {def}
              </p>
            </div>
          )}

          {/* Collocations Pills */}
          {enrichedData?.collocations && enrichedData.collocations.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#18231F]/40 block">
                IELTS Kollokatsiyalari
              </span>
              <div className="flex flex-wrap gap-1">
                {enrichedData.collocations.map((col, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[11px] font-medium bg-[#DCE9DF]/70 text-[#315C4A] rounded-md"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Context Sentence */}
          {contextSentence && (
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#18231F]/40 block">
                Matndagi original kontekst
              </span>
              <p className="text-xs text-[#18231F]/70 italic bg-[#F7F6F0] p-2.5 rounded-lg border border-[#18231F]/6">
                &ldquo;{contextSentence}&rdquo;
              </p>
            </div>
          )}

          {/* Save Action */}
          <div className="pt-2 border-t border-[#18231F]/8 space-y-2">
            {isSaved || justSaved ? (
              <div className="flex items-center justify-between p-3 bg-[#DCE9DF]/70 border border-[#315C4A]/30 rounded-xl text-[#315C4A] text-xs">
                <span className="flex items-center font-semibold">
                  <Check className="w-4 h-4 mr-1.5 text-[#315C4A]" />
                  Lug'atingizga saqlandi!
                </span>
                {vocabItem && (
                  <Link
                    href={`/vocabulary/${vocabItem.id}`}
                    className="font-bold underline hover:text-[#18231F] flex items-center ml-2"
                  >
                    Ko'rish
                    <ArrowRight className="w-3 h-3 ml-0.5" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-[#18231F]/50 font-mono text-[11px]">Kolleksiya:</span>
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="text-xs bg-[#F7F6F0] border border-[#18231F]/15 rounded-lg px-2.5 py-1 text-[#18231F] focus:outline-none focus:ring-1 focus:ring-[#315C4A]"
                  >
                    <option value="Reading Vault">Reading Vault</option>
                    <option value="IELTS Academic">IELTS Academic</option>
                    <option value="Scientific & Tech">Scientific &amp; Tech</option>
                  </select>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full justify-center shadow-sm font-semibold bg-[#315C4A] hover:bg-[#18231F] text-white py-2.5 rounded-xl"
                  onClick={handleSave}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  Lug'atga saqlash (+ Vault)
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
