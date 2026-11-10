'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Trash2, Edit3, Check } from 'lucide-react';
import { VocabularyItem } from '@/types/database';

interface VocabularyManageTableProps {
  vocabulary: VocabularyItem[];
  onAddWord: () => void;
  onEditWord: (id: string, updates: Partial<VocabularyItem>) => void;
}

export function VocabularyManageTable({
  vocabulary,
  onAddWord,
  onEditWord,
}: VocabularyManageTableProps) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTranslation, setEditTranslation] = useState('');

  const filtered = vocabulary.filter(v =>
    v.lemma.toLowerCase().includes(search.toLowerCase()) ||
    v.translationUz.toLowerCase().includes(search.toLowerCase()) ||
    v.definitionEn.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (item: VocabularyItem) => {
    setEditingId(item.id);
    setEditTranslation(item.translationUz);
  };

  const saveEdit = (id: string) => {
    if (editTranslation.trim()) {
      onEditWord(id, { translationUz: editTranslation.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-xl border border-ivory-200 shadow-subtle overflow-hidden space-y-4 p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Input
            placeholder="Search master vocabulary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-ink-400" />}
          />
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-mono text-ink-500">
            {filtered.length} entries
          </span>
          <Button variant="primary" size="sm" onClick={onAddWord}>
            <Plus className="w-4 h-4 mr-1" />
            Add Master Word
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-ivory-100 border-b border-ivory-200 text-ink-500 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Lemma</th>
              <th className="py-3 px-3 font-semibold">Level</th>
              <th className="py-3 px-3 font-semibold">POS</th>
              <th className="py-3 px-4 font-semibold">O&apos;zbekcha Tarjima</th>
              <th className="py-3 px-4 font-semibold">English Definition</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-200">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-ivory-50/70 transition">
                <td className="py-3 px-4">
                  <span className="font-serif text-sm font-bold text-ink-950 block">
                    {item.lemma}
                  </span>
                  <span className="text-[11px] font-mono text-ink-400">{item.pronunciationIpa}</span>
                </td>

                <td className="py-3 px-3">
                  <Badge variant="outline" size="sm">
                    {item.cefrLevel}
                  </Badge>
                </td>

                <td className="py-3 px-3 font-mono text-ink-600 italic">
                  {item.partOfSpeech}
                </td>

                <td className="py-3 px-4">
                  {editingId === item.id ? (
                    <div className="flex items-center space-x-1">
                      <input
                        type="text"
                        value={editTranslation}
                        onChange={(e) => setEditTranslation(e.target.value)}
                        className="text-xs border border-forest-500 rounded px-2 py-1 w-full bg-white"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="p-1 rounded bg-forest-700 text-white"
                        title="Save translation"
                        aria-label="Save translation"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="font-medium text-forest-800">
                      {item.translationUz}
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 text-ink-600 line-clamp-2 max-w-xs">
                  {item.definitionEn}
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => startEdit(item)}
                      className="p-1.5 rounded text-ink-500 hover:text-ink-950 hover:bg-ivory-200"
                      title="Edit Translation"
                      aria-label="Edit word translation"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
