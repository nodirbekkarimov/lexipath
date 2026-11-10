'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { SpeakButton } from '@/components/ui/SpeakButton';
import { useLexiPathStore } from '@/lib/data-store';
import { CEFRLevel, PartOfSpeech } from '@/types/database';
import { Sparkles, Loader2, Check, ChevronDown, ChevronUp, BookOpen, Volume2 } from 'lucide-react';

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLemma?: string;
  defaultContext?: string;
}

export function AddWordModal({
  isOpen,
  onClose,
  defaultLemma = '',
  defaultContext = '',
}: AddWordModalProps) {
  const store = useLexiPathStore();

  const [lemma, setLemma] = useState(defaultLemma);
  const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech>('adjective');
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>('C1');
  const [ieltsBand, setIeltsBand] = useState<number>(7.5);
  const [definitionEn, setDefinitionEn] = useState('');
  const [translationUz, setTranslationUz] = useState('');
  const [uzbekContextNotes, setUzbekContextNotes] = useState('');
  const [pronunciationIpa, setPronunciationIpa] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [contextSentence, setContextSentence] = useState(defaultContext);
  const [collocations, setCollocations] = useState<string[]>([]);
  const [paraphrases, setParaphrases] = useState<any[]>([]);
  const [collection, setCollection] = useState('IELTS Academic');

  const [isEnriching, setIsEnriching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasEnriched, setHasEnriched] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState('');

  // Handle word enrichment via API
  const enrichWord = useCallback(async (wordToEnrich: string) => {
    const clean = wordToEnrich.trim();
    if (!clean || clean.length < 2) return;

    setIsEnriching(true);
    setError('');

    try {
      const res = await fetch('/api/ai/enrich-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: clean, context: contextSentence || defaultContext }),
      });

      if (!res.ok) throw new Error('Enrichment failed');

      const { data } = await res.json();
      if (data) {
        setPartOfSpeech(data.partOfSpeech || 'adjective');
        setCefrLevel(data.cefrLevel || 'C1');
        setIeltsBand(data.ieltsBand || 7.5);
        setDefinitionEn(data.definitionEn || '');
        setTranslationUz(data.translationUz || '');
        setUzbekContextNotes(data.uzbekContextNotes || '');
        setPronunciationIpa(data.phoneticIpa || `/${clean}/`);
        setAudioUrl(data.audioUrl || undefined);
        if (!contextSentence && data.contextSentence) {
          setContextSentence(data.contextSentence);
        }
        setCollocations(data.collocations || []);
        setParaphrases(data.paraphrases || []);
        setHasEnriched(true);
      }
    } catch (err: any) {
      console.warn('Auto-enrichment fallback used:', err.message);
    } finally {
      setIsEnriching(false);
    }
  }, [contextSentence, defaultContext]);

  // When modal opens with a default lemma, auto-enrich immediately
  useEffect(() => {
    if (isOpen) {
      if (defaultLemma) {
        setLemma(defaultLemma);
        enrichWord(defaultLemma);
      }
      if (defaultContext) {
        setContextSentence(defaultContext);
      }
    } else {
      // Reset state on close
      setLemma('');
      setTranslationUz('');
      setDefinitionEn('');
      setPronunciationIpa('');
      setContextSentence('');
      setCollocations([]);
      setParaphrases([]);
      setHasEnriched(false);
      setShowAdvanced(false);
      setError('');
    }
  }, [isOpen, defaultLemma, defaultContext, enrichWord]);

  // Handle quick blur or enter key on the main lemma input
  const handleLemmaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!hasEnriched) {
        enrichWord(lemma);
      } else {
        handleSubmit(e);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lemma.trim()) {
      setError('Iltimos, so\'zni kiriting.');
      return;
    }

    setIsSubmitting(true);
    try {
      store.addWord(
        {
          lemma: lemma.trim(),
          partOfSpeech,
          cefrLevel,
          definitionEn: definitionEn.trim() || `${lemma} definition`,
          translationUz: translationUz.trim() || `${lemma} tarjimasi`,
          pronunciationIpa: pronunciationIpa.trim() || `/${lemma.toLowerCase()}/`,
          contextSentence: contextSentence.trim(),
          ieltsTopic: 'General Academic',
        },
        contextSentence.trim(),
        collection
      );

      onClose();
    } catch (err) {
      setError('So\'zni saqlashda xatolik yuz berdi. Qayta urinib ko\'ring.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lug'atga yangi so'z qo'shish"
      description="Faqat so'zni kiriting — tizim CEFR darajasi, o'zbekcha tarjimasi, talaffuzi va misollarini avtomatik ajratib beradi."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {error && (
          <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Primary Word Input with Magic Auto-Enrich Button */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#18231F]/70 mb-1.5">
            Inglizcha so'z yoki ibora <span className="text-[#315C4A]">*</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={lemma}
                onChange={(e) => {
                  setLemma(e.target.value);
                  setHasEnriched(false);
                }}
                onKeyDown={handleLemmaKeyDown}
                placeholder="Masalan: ubiquitous, resilient, ameliorate..."
                autoFocus
                required
                className="w-full px-4 py-3 text-base font-medium text-[#18231F] bg-[#F7F6F0] border border-[#18231F]/15 rounded-xl placeholder-[#18231F]/30 focus:outline-none focus:ring-2 focus:ring-[#315C4A]/30 focus:border-[#315C4A] transition-all"
              />
              {lemma && pronunciationIpa && hasEnriched && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <SpeakButton text={lemma} audioUrl={audioUrl} size="sm" />
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => enrichWord(lemma)}
              disabled={isEnriching || !lemma.trim()}
              className="px-4 py-3 flex items-center gap-1.5 font-semibold text-xs whitespace-nowrap bg-[#DCE9DF] hover:bg-[#DCE9DF]/80 text-[#315C4A] border-none rounded-xl"
            >
              {isEnriching ? (
                <>
                  <Loader2 size={16} className="animate-spin text-[#315C4A]" />
                  <span>Aniqlanmoqda...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-[#315C4A]" />
                  <span>Avto-tahlil</span>
                </>
              )}
            </Button>
          </div>
          <p className="mt-1 text-[11px] text-[#18231F]/45">
            💡 So'zni yozib <kbd className="px-1.5 py-0.5 bg-[#18231F]/5 rounded border border-[#18231F]/10 text-[10px]">Enter</kbd> tugmasini bosing yoki "Avto-tahlil"ni bosing.
          </p>
        </div>

        {/* AI Analyzed Preview Card */}
        {(hasEnriched || translationUz || isEnriching) && (
          <div className="bg-[#FAF9F5] border border-[#315C4A]/20 rounded-xl p-4 space-y-3.5 transition-all animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#18231F]/8 pb-2.5">
              <div className="flex items-center gap-2.5">
                <span className="font-serif text-lg font-bold text-[#18231F]">
                  {lemma || 'So\'z'}
                </span>
                {pronunciationIpa && (
                  <span className="text-xs text-[#18231F]/50 font-mono">
                    {pronunciationIpa}
                  </span>
                )}
                {lemma && <SpeakButton text={lemma} audioUrl={audioUrl} size="sm" />}
              </div>

              <div className="flex items-center gap-1.5">
                <Badge variant="primary" size="sm">
                  {cefrLevel} • Band {ieltsBand}
                </Badge>
                <Badge variant="neutral" size="sm" className="capitalize">
                  {partOfSpeech}
                </Badge>
              </div>
            </div>

            {/* Uzbek Translation (Quick Edit) */}
            <div>
              <label className="block text-xs font-semibold text-[#315C4A] uppercase tracking-wider mb-1">
                🇺🇿 O'zbekcha ma'nosi &amp; tarjimasi
              </label>
              <input
                type="text"
                value={translationUz}
                onChange={(e) => setTranslationUz(e.target.value)}
                placeholder="O'zbekcha tarjimasi..."
                required
                className="w-full px-3 py-2 text-sm font-semibold text-[#18231F] bg-white border border-[#315C4A]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315C4A]/20 focus:border-[#315C4A]"
              />
              {uzbekContextNotes && (
                <p className="mt-1 text-xs text-[#18231F]/60 italic">
                  💡 {uzbekContextNotes}
                </p>
              )}
            </div>

            {/* English Academic Definition */}
            {definitionEn && (
              <div>
                <span className="text-xs font-semibold text-[#18231F]/50 uppercase tracking-wider block mb-1">
                  Akademik ta'rifi (Inglizcha)
                </span>
                <p className="text-xs text-[#18231F]/80 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-[#18231F]/6">
                  {definitionEn}
                </p>
              </div>
            )}

            {/* Wisdom Dictionary-Style Paraphrases & Academic Alternatives */}
            {paraphrases && paraphrases.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-[#315C4A] uppercase tracking-wider flex items-center gap-1.5">
                    <span>💎 Wisdom Paraphrase &amp; Sinonimlar</span>
                  </span>
                  <span className="text-[10px] text-[#18231F]/40 font-medium">IELTS Writing &amp; Speaking uchun</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {paraphrases.map((p, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-2.5 rounded-lg border border-[#315C4A]/15 hover:border-[#315C4A]/40 transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-[#18231F]">
                          {p.word}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#315C4A] text-white">
                            {p.cefr}
                          </span>
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#F7F6F0] text-[#315C4A] border border-[#315C4A]/30">
                            Band {p.band}
                          </span>
                        </div>
                      </div>
                      {p.nuanceUz && (
                        <p className="mt-1 text-[11px] text-[#18231F]/70 leading-snug">
                          {p.nuanceUz}
                        </p>
                      )}
                      {p.collocation && (
                        <span className="mt-1 text-[10px] text-[#315C4A] font-mono italic">
                          ↳ {p.collocation}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Collocations Pills */}
            {collocations && collocations.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-[#18231F]/50 uppercase tracking-wider block mb-1.5">
                  IELTS Kollokatsiyalari
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {collocations.map((c, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs font-medium bg-[#DCE9DF]/60 text-[#315C4A] rounded-md border border-[#315C4A]/15"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Context Sentence */}
            {contextSentence && (
              <div>
                <span className="text-xs font-semibold text-[#18231F]/50 uppercase tracking-wider block mb-1">
                  Misol gap (IELTS kontekst)
                </span>
                <p className="text-xs text-[#18231F]/80 italic bg-white/70 p-2.5 rounded-lg border border-[#18231F]/6">
                  "{contextSentence}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Collapsible Advanced Settings */}
        <div className="border-t border-[#18231F]/8 pt-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 text-xs font-semibold text-[#18231F]/60 hover:text-[#18231F] transition-colors"
          >
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>Qo'shimcha parametrlarni tahrirlash (ixtiyoriy)</span>
          </button>

          {showAdvanced && (
            <div className="space-y-3 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="CEFR Darajasi"
                  value={cefrLevel}
                  onChange={(e) => setCefrLevel(e.target.value as CEFRLevel)}
                  options={[
                    { value: 'B1', label: 'B1 — Intermediate (5.0 - 5.5)' },
                    { value: 'B2', label: 'B2 — Upper-Int. (6.0 - 6.5)' },
                    { value: 'C1', label: 'C1 — Advanced (7.0 - 7.5)' },
                    { value: 'C2', label: 'C2 — Mastery (8.0 - 9.0)' },
                  ]}
                />
                <Select
                  label="So'z turkumi"
                  value={partOfSpeech}
                  onChange={(e) => setPartOfSpeech(e.target.value as PartOfSpeech)}
                  options={[
                    { value: 'adjective', label: 'Sifat (Adjective)' },
                    { value: 'noun', label: 'Ot (Noun)' },
                    { value: 'verb', label: 'Fe\'l (Verb)' },
                    { value: 'adverb', label: 'Ravish (Adverb)' },
                    { value: 'phrase', label: 'Ibora (Phrase / Collocation)' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Transkripsiya (IPA)"
                  value={pronunciationIpa}
                  onChange={(e) => setPronunciationIpa(e.target.value)}
                  placeholder="/juːˈbɪkwɪtəs/"
                />
                <Input
                  label="Kolleksiya / Guruh"
                  value={collection}
                  onChange={(e) => setCollection(e.target.value)}
                  placeholder="IELTS Academic"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#18231F]/70 mb-1">
                  Shaxsiy misol gap (Ixtiyoriy)
                </label>
                <textarea
                  value={contextSentence}
                  onChange={(e) => setContextSentence(e.target.value)}
                  rows={2}
                  placeholder="So'z qatnashgan gapni kiriting..."
                  className="w-full px-3.5 py-2 text-xs text-[#18231F] bg-[#F7F6F0] border border-[#18231F]/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#315C4A]/30"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#18231F]/8">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Bekor qilish
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !lemma.trim()}
            className="flex items-center gap-2 px-6 py-2.5 font-semibold bg-[#315C4A] hover:bg-[#18231F] text-white rounded-xl shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saqlanmoqda...</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>Lug'atga saqlash</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
