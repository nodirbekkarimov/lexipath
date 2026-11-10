'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Layers, 
  HelpCircle,
  Archive
} from 'lucide-react';
import { MOCK_PASSAGES } from '@/data/mock-data';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, CefrBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Passage, ContentStatus } from '@/types/database';

export default function AdminReadingPage() {
  const [passages, setPassages] = useState<Passage[]>(MOCK_PASSAGES);
  const [previewPassage, setPreviewPassage] = useState<Passage | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New passage form state
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleCreatePassage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPass: Passage = {
      id: `pass-${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      topic: newTopic || 'General Academic',
      cefrLevel: 'C1',
      targetBand: 7.5,
      estimatedReadingMinutes: 4,
      wordCount: newContent.split(/\s+/).length || 380,
      excerpt: newContent.slice(0, 140) + '...',
      contentMarkdown: newContent,
      status: 'published',
      highlightedWordIds: ['vocab-1', 'vocab-3'],
      questions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPassages((prev) => [newPass, ...prev]);
    setIsNewModalOpen(false);
    setNewTitle('');
    setNewTopic('');
    setNewContent('');
    setToastMessage('Yangi mutolaa matni muvaffaqiyatli nashr etildi!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleStatus = (id: string, current: ContentStatus) => {
    const next: ContentStatus = current === 'published' ? 'archived' : 'published';
    setPassages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: next } : p))
    );
    setToastMessage(`Matn holati o'zgartirildi: ${next}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-800 text-white px-4 py-3 rounded-xl shadow-elevated text-xs animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-ivory-200/90 pb-6 gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-semibold">
            Passage Ingestion & CMS
          </span>
          <h1 className="font-serif text-3xl font-bold text-ink-950 mt-1">
            Reading Content Management
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            IELTS va CEFR akademik mutolaa matnlarini tahrirlash, target leksikani belgilash va savollar tuzish.
          </p>
        </div>

        <Button
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsNewModalOpen(true)}
        >
          Yangi Matn Kiritish
        </Button>
      </div>

      {/* Passages Table */}
      <div className="bg-white rounded-xl border border-ivory-200/90 overflow-hidden shadow-card">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-ivory-200 bg-ivory-50/80 text-ink-500 font-mono text-[11px] uppercase">
              <th className="py-3 px-4 font-semibold">Passage Title</th>
              <th className="py-3 px-2 font-semibold">Topic</th>
              <th className="py-3 px-2 font-semibold">CEFR</th>
              <th className="py-3 px-2 font-semibold">Words</th>
              <th className="py-3 px-2 font-semibold">Questions</th>
              <th className="py-3 px-2 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-100">
            {passages.map((p) => (
              <tr key={p.id} className="hover:bg-ivory-50/60 transition">
                <td className="py-3.5 px-4 font-serif font-bold text-ink-950 text-sm">
                  {p.title}
                </td>
                <td className="py-3.5 px-2 text-ink-700 font-medium">
                  {p.topic}
                </td>
                <td className="py-3.5 px-2">
                  <CefrBadge level={p.cefrLevel} />
                </td>
                <td className="py-3.5 px-2 font-mono text-ink-500">
                  {p.wordCount} words
                </td>
                <td className="py-3.5 px-2 font-mono text-ink-500">
                  {p.questions.length} questions
                </td>
                <td className="py-3.5 px-2">
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      p.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-ivory-200 text-ink-600'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button
                    onClick={() => setPreviewPassage(p)}
                    className="text-xs font-semibold text-forest-700 hover:text-forest-900"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleToggleStatus(p.id, p.status)}
                    className="text-xs font-semibold text-ink-500 hover:text-ink-800"
                  >
                    {p.status === 'published' ? 'Archive' : 'Publish'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Passage Preview Modal */}
      {previewPassage && (
        <Modal
          isOpen={!!previewPassage}
          onClose={() => setPreviewPassage(null)}
          title={previewPassage.title}
          subtitle={`Topic: ${previewPassage.topic} • ${previewPassage.wordCount} words • Band ${previewPassage.targetBand}`}
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="prose prose-slate max-w-none text-ink-900 font-serif text-sm leading-relaxed whitespace-pre-line p-4 bg-ivory-50 rounded-xl border border-ivory-200">
              {previewPassage.contentMarkdown}
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-ivory-200">
              <span className="font-mono text-ink-500 text-[11px]">
                Target vocabulary count: {previewPassage.highlightedWordIds.length}
              </span>
              <Button size="sm" onClick={() => setPreviewPassage(null)}>
                Yopish
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* New Passage Ingestion Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Yangi Akademik Mutolaa Matnini Kiritish"
        subtitle="IELTS Reading andozasidagi ilmiy yoki ijtimoiy maqolani joylashtiring"
        maxWidth="xl"
      >
        <form onSubmit={handleCreatePassage} className="space-y-4 text-xs">
          <Input
            label="Matn Sarlavhasi (Passage Title)"
            placeholder="e.g. Cognitive Psychology and Neural Plasticity"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Mavzu / Soha (Topic)"
              placeholder="e.g. Neuroscience & Cognitive Pedagogy"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              required
            />
            <Select
              label="CEFR Darajasi"
              options={[
                { value: 'B2', label: 'B2 (Intermediate Academic)' },
                { value: 'C1', label: 'C1 (Advanced IELTS 7.0 - 8.0)' },
                { value: 'C2', label: 'C2 (Expert IELTS 8.5 - 9.0)' },
              ]}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-ink-800">
              Matn Mazmuni (Markdown or Plain Text)
            </label>
            <textarea
              rows={8}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Matnni bu yerga joylashtiring. AI avtomatik tarzda C1/C2 so'zlarni ajratib oladi..."
              className="w-full bg-ivory-50 border border-ivory-300 rounded-lg p-3 text-xs text-ink-950 focus:outline-none focus:ring-1 focus:ring-forest-700 font-serif leading-relaxed"
              required
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2 border-t border-ivory-200">
            <Button variant="outline" size="sm" onClick={() => setIsNewModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" size="sm">
              Nashr Etish
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
