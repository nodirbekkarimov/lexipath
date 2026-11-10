'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useLexiPathStore } from '@/lib/data-store';
import { exportToAnkiTSV, exportToTelegramPost, downloadFile } from '@/lib/export/vocabulary-export';
import { Download, Send, Check, Copy, FileSpreadsheet, Share2 } from 'lucide-react';

interface ExportVocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportVocabularyModal({ isOpen, onClose }: ExportVocabularyModalProps) {
  const store = useLexiPathStore();
  const words = store.vocabulary || [];

  const [selectedWordId, setSelectedWordId] = useState<string>(words[0]?.id || '');
  const [copiedTelegram, setCopiedTelegram] = useState(false);

  const activeWord = words.find((w) => w.id === selectedWordId) || words[0];

  const handleExportAnki = () => {
    const tsvData = exportToAnkiTSV(words);
    const filename = `lexipath-anki-deck-${new Date().toISOString().split('T')[0]}.txt`;
    downloadFile(tsvData, filename, 'text/tab-separated-values;charset=utf-8');
  };

  const handleExportJSON = () => {
    const jsonData = JSON.stringify(words, null, 2);
    const filename = `lexipath-vocabulary-backup-${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(jsonData, filename, 'application/json');
  };

  const handleCopyTelegram = () => {
    if (!activeWord) return;
    const post = exportToTelegramPost(activeWord);
    navigator.clipboard.writeText(post);
    setCopiedTelegram(true);
    setTimeout(() => setCopiedTelegram(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lug'atni Eksport Qilish"
      description="Shaxsiy so'z boyligingizni Anki dasturiga yuklang yoki Telegram kanallarga chiroyli formatda ulashing."
      size="lg"
    >
      <div className="space-y-6 pt-2">
        {/* 1. Anki Export Card */}
        <div className="p-4 bg-white border border-[#18231F]/10 rounded-xl space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#315C4A]/10 text-[#315C4A] flex items-center justify-center">
                <FileSpreadsheet size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#18231F]">
                  Anki (.txt / TSV) formati
                </h4>
                <p className="text-xs text-[#18231F]/50">
                  Jami {words.length} ta so'z, O'zbekcha tarjima, ta'rif va CEFR teglari bilan
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={handleExportAnki}
              className="bg-[#315C4A] hover:bg-[#18231F] text-white rounded-lg text-xs py-2 shadow-xs"
            >
              <Download size={14} className="mr-1.5" /> Anki faylni yuklab olish
            </Button>
          </div>
        </div>

        {/* 2. Telegram Post Generator */}
        <div className="p-4 bg-white border border-[#18231F]/10 rounded-xl space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <Send size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#18231F]">
                  Telegram Study Post
                </h4>
                <p className="text-xs text-[#18231F]/50">
                  Kanal yoki guruhga 1-klikda joylash uchun chiroyli post
                </p>
              </div>
            </div>

            {/* Word selector dropdown */}
            <select
              value={selectedWordId}
              onChange={(e) => setSelectedWordId(e.target.value)}
              className="text-xs bg-[#F7F6F0] border border-[#18231F]/15 rounded-lg px-2.5 py-1.5 text-[#18231F] focus:outline-none focus:ring-1 focus:ring-[#315C4A]"
            >
              {words.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.lemma || w.word} ({w.cefrLevel || 'C1'})
                </option>
              ))}
            </select>
          </div>

          {activeWord && (
            <div className="relative">
              <pre className="p-3 bg-[#F7F6F0] rounded-xl text-xs font-mono text-[#18231F]/80 whitespace-pre-wrap max-h-40 overflow-y-auto border border-[#18231F]/5">
                {exportToTelegramPost(activeWord)}
              </pre>
              <button
                type="button"
                onClick={handleCopyTelegram}
                className="absolute top-2 right-2 px-3 py-1 bg-white hover:bg-[#315C4A] text-[#18231F] hover:text-white border border-[#18231F]/10 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow-xs"
              >
                {copiedTelegram ? (
                  <>
                    <Check size={13} className="text-emerald-500" /> Nusxalandi!
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Telegramga nusxalash
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 3. JSON Backup */}
        <div className="flex items-center justify-between pt-2 border-t border-[#18231F]/10">
          <span className="text-xs text-[#18231F]/45">
            Zaxira nusxa: to'liq ma'lumotlar bazasini JSON formatida saqlash.
          </span>
          <button
            type="button"
            onClick={handleExportJSON}
            className="text-xs text-[#315C4A] hover:underline font-semibold flex items-center gap-1"
          >
            <Download size={13} /> JSON zaxira yuklash
          </button>
        </div>
      </div>
    </Modal>
  );
}
