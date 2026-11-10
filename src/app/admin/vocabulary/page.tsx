'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Plus, 
  Check, 
  Edit3, 
  Archive, 
  Sparkles, 
  Volume2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MOCK_VOCABULARY } from '@/data/mock-data';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, CefrBadge } from '@/components/ui/Badge';
import { SearchInput } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { VocabularyItem, CEFRLevel, PartOfSpeech, VerificationStatus } from '@/types/database';

export default function AdminVocabularyPage() {
  const [vocabList, setVocabList] = useState<VocabularyItem[]>(MOCK_VOCABULARY);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCefr, setSelectedCefr] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Modal states
  const [editItem, setEditItem] = useState<VocabularyItem | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [actionToast, setActionToast] = useState<string | null>(null);

  const filteredItems = vocabList.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.translationUz.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definitionEn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCefr = selectedCefr === 'all' || item.cefrLevel === selectedCefr;
    const matchesStatus = selectedStatus === 'all' || item.verificationStatus === selectedStatus;

    return matchesSearch && matchesCefr && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setVocabList((prev) =>
      prev.map((v) => (v.id === id ? { ...v, verificationStatus: 'verified' } : v))
    );
    setActionToast('So\'z muvaffaqiyatli tasdiqlandi!');
    setTimeout(() => setActionToast(null), 2500);
  };

  const handleArchive = (id: string) => {
    setVocabList((prev) =>
      prev.map((v) => (v.id === id ? { ...v, verificationStatus: 'rejected' } : v))
    );
    setActionToast('So\'z arxivlandi.');
    setTimeout(() => setActionToast(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-800 text-white px-4 py-3 rounded-xl shadow-elevated text-xs animate-in fade-in">
          {actionToast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-ivory-200/90 pb-6 gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-semibold">
            Standardized Lexical Repository
          </span>
          <h1 className="font-serif text-3xl font-bold text-ink-950 mt-1">
            Vocabulary Management
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            Global lug'at bazasi, akademik ta'riflar, O'zbekcha tarjimalar va sun'iy intellekt tomonidan kiritilgan birliklarni nazorat qilish.
          </p>
        </div>

        <Button
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsNewModalOpen(true)}
        >
          Yangi So'z Qo'shish
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-ivory-200/90 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-card">
        <div className="w-full md:w-80">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search word, Uzbek meaning, or definition..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto">
          <span className="font-mono text-[11px] text-ink-400 uppercase">CEFR:</span>
          {['all', 'B2', 'C1', 'C2'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedCefr(lvl)}
              className={`px-2.5 py-1 rounded-md font-mono transition ${
                selectedCefr === lvl
                  ? 'bg-forest-700 text-white font-bold'
                  : 'bg-ivory-100 text-ink-700 hover:bg-ivory-200'
              }`}
            >
              {lvl.toUpperCase()}
            </button>
          ))}

          <div className="h-4 w-px bg-ivory-300 mx-1 hidden sm:block" />

          <span className="font-mono text-[11px] text-ink-400 uppercase">Status:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'verified', label: 'Verified' },
            { id: 'pending_review', label: 'Pending AI' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-2.5 py-1 rounded-md transition ${
                selectedStatus === st.id
                  ? 'bg-forest-700 text-white font-bold'
                  : 'bg-ivory-100 text-ink-700 hover:bg-ivory-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary Table */}
      <div className="bg-white rounded-xl border border-ivory-200/90 overflow-hidden shadow-card">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-ivory-200 bg-ivory-50/80 text-ink-500 font-mono text-[11px] uppercase">
              <th className="py-3 px-4 font-semibold">Lemma / POS</th>
              <th className="py-3 px-2 font-semibold">CEFR</th>
              <th className="py-3 px-2 font-semibold">O'zbekcha Tarjima</th>
              <th className="py-3 px-2 font-semibold">Status</th>
              <th className="py-3 px-2 font-semibold">Source</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-100">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-ivory-50/60 transition">
                <td className="py-3 px-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-serif font-bold text-ink-950 text-sm">
                      {item.word}
                    </span>
                    <span className="font-mono text-[11px] text-ink-400">
                      {item.pos}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-ink-500 mt-0.5">
                    {item.phoneticIpa}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <CefrBadge level={item.cefrLevel} />
                </td>
                <td className="py-3 px-2 text-ink-800 italic max-w-sm truncate">
                  "{item.translationUz}"
                </td>
                <td className="py-3 px-2">
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      item.verificationStatus === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.verificationStatus === 'pending_review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-ivory-200 text-ink-600'
                    }`}
                  >
                    {item.verificationStatus.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-2 font-mono text-ink-500">
                  {item.aiGenerated ? 'AI Generated' : 'Human Curated'}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  {item.verificationStatus === 'pending_review' && (
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => setEditItem(item)}
                    className="text-xs font-semibold text-forest-700 hover:text-forest-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleArchive(item.id)}
                    className="text-xs font-semibold text-ink-400 hover:text-ink-700"
                  >
                    Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Word Modal */}
      {editItem && (
        <Modal
          isOpen={!!editItem}
          onClose={() => setEditItem(null)}
          title={`Leksik Birlikni Tahrirlash: ${editItem.word}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <Input
              label="English Word"
              value={editItem.word}
              onChange={(e) => setEditItem({ ...editItem, word: e.target.value })}
            />

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-ink-800">
                O'zbekcha Tarjima va Sharh
              </label>
              <textarea
                rows={2}
                value={editItem.translationUz}
                onChange={(e) => setEditItem({ ...editItem, translationUz: e.target.value })}
                className="w-full bg-ivory-50 border border-ivory-300 rounded-lg p-2.5 text-xs text-ink-950 focus:outline-none focus:ring-1 focus:ring-forest-700 font-serif"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-ink-800">
                O'zbek O'quvchilari Uchun Maxsus Eslatma
              </label>
              <textarea
                rows={2}
                value={editItem.uzbekContextNotes || ''}
                onChange={(e) => setEditItem({ ...editItem, uzbekContextNotes: e.target.value })}
                className="w-full bg-ivory-50 border border-ivory-300 rounded-lg p-2.5 text-xs text-ink-950 focus:outline-none focus:ring-1 focus:ring-forest-700"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-ink-800">
                Academic English Definition
              </label>
              <textarea
                rows={2}
                value={editItem.definitionEn}
                onChange={(e) => setEditItem({ ...editItem, definitionEn: e.target.value })}
                className="w-full bg-ivory-50 border border-ivory-300 rounded-lg p-2.5 text-xs text-ink-950 focus:outline-none focus:ring-1 focus:ring-forest-700"
              />
            </div>

            <div className="pt-3 flex justify-end space-x-2 border-t border-ivory-200">
              <Button variant="outline" size="sm" onClick={() => setEditItem(null)}>
                Bekor qilish
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setVocabList((prev) =>
                    prev.map((v) => (v.id === editItem.id ? editItem : v))
                  );
                  setEditItem(null);
                  setActionToast('O\'zgarishlar muvaffaqiyatli saqlandi!');
                  setTimeout(() => setActionToast(null), 2500);
                }}
              >
                Saqlash
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* New Word Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Yangi Leksik Birlik Qo'shish"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <Input label="Word" placeholder="e.g. elucidate" required />
          <Input label="Phonetic IPA" placeholder="/iˈluː.sɪ.deɪt/" />
          <Select
            label="Part of Speech"
            options={[
              { value: 'verb', label: 'Verb' },
              { value: 'noun', label: 'Noun' },
              { value: 'adjective', label: 'Adjective' },
              { value: 'adverb', label: 'Adverb' },
            ]}
          />
          <Input label="O'zbekcha Tarjima" placeholder="oydinlashtirmoq, tushuntirmoq" required />
          <div className="pt-3 flex justify-end space-x-2 border-t border-ivory-200">
            <Button variant="outline" size="sm" onClick={() => setIsNewModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsNewModalOpen(false);
                setActionToast('Yangi so\'z bazaga kiritildi!');
                setTimeout(() => setActionToast(null), 2500);
              }}
            >
              Bazaga Qo'shish
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
