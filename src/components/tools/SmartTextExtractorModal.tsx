'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useLexiPathStore } from '@/lib/data-store';
import { ExtractedWordItem, extractAcademicWordsFromText } from '@/lib/nlp/text-extractor';
import { Sparkles, FileText, CheckCircle2, Plus, ArrowRight, Loader2, BookOpen } from 'lucide-react';

interface SmartTextExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_IELTS_TEXT = `Recent longitudinal studies elucidate how ubiquitous digital technologies exert both beneficial and perilous effects on adolescent cognitive development. While smartphones facilitate seamless scholarly collaboration and foster academic resilience, excessive engagement frequently engenders chronic sleep deficits. Consequently, developing comprehensive educational strategies is of paramount importance to bolster digital literacy without precipitating widespread attention deficits.`;

export function SmartTextExtractorModal({ isOpen, onClose }: SmartTextExtractorModalProps) {
  const store = useLexiPathStore();

  const [rawText, setRawText] = useState('');
  const [extractedWords, setExtractedWords] = useState<ExtractedWordItem[]>([]);
  const [selectedLemmas, setSelectedLemmas] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAnalyze = () => {
    if (!rawText.trim()) return;
    setIsAnalyzing(true);
    setSavedSuccess(false);

    // Run local extractor with sub-50ms speed
    setTimeout(() => {
      const results = extractAcademicWordsFromText(rawText);
      setExtractedWords(results);
      // Pre-select all extracted words
      setSelectedLemmas(new Set(results.map((w) => w.lemma)));
      setIsAnalyzing(false);
    }, 150);
  };

  const handleToggleWord = (lemma: string) => {
    const next = new Set(selectedLemmas);
    if (next.has(lemma)) {
      next.delete(lemma);
    } else {
      next.add(lemma);
    }
    setSelectedLemmas(next);
  };

  const handleSelectAll = () => {
    if (selectedLemmas.size === extractedWords.length) {
      setSelectedLemmas(new Set());
    } else {
      setSelectedLemmas(new Set(extractedWords.map((w) => w.lemma)));
    }
  };

  const handleSaveSelected = () => {
    const toSave = extractedWords.filter((w) => selectedLemmas.has(w.lemma));
    if (toSave.length === 0) return;

    store.addBatchWords(
      toSave.map((w) => ({
        lemma: w.lemma,
        word: w.lemma,
        cefrLevel: w.cefrLevel,
        ieltsBand: w.ieltsBand,
        partOfSpeech: w.partOfSpeech,
        definitionEn: w.definitionEn || `${w.lemma} (academic contextual usage)`,
        translationUz: w.translationUz || `${w.lemma} o'zbekcha ma'nosi`,
        contextSentence: w.contextSentence,
      })),
      'Matndan ajratilgan so\'zlar'
    );

    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
      setSavedSuccess(false);
      setRawText('');
      setExtractedWords([]);
    }, 1200);
  };

  const handleInsertSample = () => {
    setRawText(SAMPLE_IELTS_TEXT);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Smart Text Extractor — Matndan so'zlarni suzib olish"
      description="Istalgan IELTS Reading maqolasi yoki inshoni kiriting — tizim murakkab (B2, C1, C2) so'zlarni bir lahzada ajratib beradi."
      size="xl"
    >
      <div className="space-y-5 pt-2">
        {/* Input Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#18231F]/70">
              Inglizcha matn yoki abzas
            </label>
            <button
              type="button"
              onClick={handleInsertSample}
              className="text-xs text-[#315C4A] hover:underline flex items-center gap-1 font-medium"
            >
              <FileText size={13} /> IELTS namunaviy matnni kiritish
            </button>
          </div>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={5}
            placeholder="Matnni bu yerga nusxalab qo'ying (paste)... Masalan, Cambridge IELTS Reading passage yoki The Economist maqolasi..."
            className="w-full p-3.5 text-sm bg-[#F7F6F0] border border-[#18231F]/15 rounded-xl placeholder-[#18231F]/35 focus:outline-none focus:ring-2 focus:ring-[#315C4A]/30 focus:border-[#315C4A] transition-all resize-none font-sans"
          />
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleAnalyze}
              disabled={isAnalyzing || rawText.trim().length < 15}
              className="bg-[#315C4A] hover:bg-[#18231F] text-white rounded-xl shadow-xs"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-1.5" />
                  Tahlil qilinmoqda...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-1.5 text-amber-300" />
                  Akademik so'zlarni ajratish
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Results Area */}
        {extractedWords.length > 0 && (
          <div className="border-t border-[#18231F]/10 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[#18231F]">
                  Aniqlangan akademik so'zlar: {extractedWords.length} ta
                </span>
                <span className="text-xs text-[#18231F]/50 ml-2">
                  ({selectedLemmas.size} ta tanlandi)
                </span>
              </div>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-[#315C4A] font-semibold hover:underline"
              >
                {selectedLemmas.size === extractedWords.length
                  ? 'Barchasini bekor qilish'
                  : 'Barchasini tanlash'}
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto pr-1 space-y-2 divide-y divide-[#18231F]/5">
              {extractedWords.map((item) => {
                const isSelected = selectedLemmas.has(item.lemma);
                return (
                  <div
                    key={item.lemma}
                    onClick={() => handleToggleWord(item.lemma)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-white border-[#315C4A]/30 shadow-2xs'
                        : 'bg-[#F7F6F0]/40 border-transparent hover:bg-white hover:border-[#18231F]/10 opacity-70'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleWord(item.lemma)}
                      className="mt-1 h-4 w-4 rounded text-[#315C4A] focus:ring-[#315C4A] cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-serif font-bold text-base text-[#18231F]">
                          {item.lemma}
                        </span>
                        <span className="text-[11px] font-mono text-[#18231F]/40">
                          ({item.partOfSpeech})
                        </span>
                        <Badge
                          variant={
                            item.cefrLevel === 'C2'
                              ? 'terracotta'
                              : item.cefrLevel === 'C1'
                              ? 'primary'
                              : 'outline'
                          }
                          size="sm"
                        >
                          {item.cefrLevel}
                        </Badge>
                        <span className="text-[10px] font-semibold text-[#315C4A] bg-[#DCE9DF] px-1.5 py-0.5 rounded">
                          Band {item.ieltsBand}
                        </span>
                        {item.translationUz && (
                          <span className="text-xs text-[#18231F]/70 font-medium italic truncate">
                            — {item.translationUz}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#18231F]/60 italic line-clamp-1">
                        "{item.contextSentence}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#18231F]/10 flex items-center justify-between">
              <span className="text-xs text-[#18231F]/50">
                Tanlangan so'zlar avtomatik ravishda SM-2 intervalli takrorlashga qo'shiladi.
              </span>
              <Button
                variant="primary"
                onClick={handleSaveSelected}
                disabled={selectedLemmas.size === 0 || savedSuccess}
                className="bg-[#315C4A] hover:bg-[#18231F] text-white rounded-xl shadow-xs"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 size={16} className="mr-1.5 text-emerald-400" />
                    Lug'atga saqlandi!
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-1.5" />
                    Tanlanganlarni lug'atga saqlash ({selectedLemmas.size})
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
