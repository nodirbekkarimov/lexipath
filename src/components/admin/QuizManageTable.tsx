'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, CheckCircle2 } from 'lucide-react';
import { QuizQuestion } from '@/types/database';

interface QuizManageTableProps {
  questions: QuizQuestion[];
  onAddQuestion: () => void;
}

export function QuizManageTable({ questions, onAddQuestion }: QuizManageTableProps) {
  const [search, setSearch] = useState('');

  const filtered = questions.filter(q =>
    (q.questionText || q.prompt || '').toLowerCase().includes(search.toLowerCase()) ||
    (q.correctAnswer || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border border-ivory-200 shadow-subtle overflow-hidden space-y-4 p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search quiz items or answers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 text-xs rounded-lg border border-ivory-300 px-3 py-2 bg-ivory-50 focus:outline-none focus:ring-1 focus:ring-forest-600"
        />
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-mono text-ink-500">
            {filtered.length} quiz exercises
          </span>
          <Button variant="primary" size="sm" onClick={onAddQuestion}>
            <Plus className="w-4 h-4 mr-1" />
            New Quiz Item
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-ivory-100 border-b border-ivory-200 text-ink-500 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Prompt</th>
              <th className="py-3 px-3 font-semibold">Format</th>
              <th className="py-3 px-3 font-semibold">Level</th>
              <th className="py-3 px-4 font-semibold">Target Answer</th>
              <th className="py-3 px-4 font-semibold">Pedagogical Explanation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-200">
            {filtered.map((q) => (
              <tr key={q.id} className="hover:bg-ivory-50/70 transition">
                <td className="py-3 px-4 font-medium text-ink-950 max-w-sm">
                  {q.questionText || q.prompt}
                </td>
                <td className="py-3 px-3">
                  <Badge variant="outline" size="sm">
                    {q.questionType || q.type}
                  </Badge>
                </td>
                <td className="py-3 px-3">
                  <Badge variant="primary" size="sm">
                    {q.cefrLevel}
                  </Badge>
                </td>
                <td className="py-3 px-4 font-bold text-forest-800">
                  {q.correctAnswer}
                </td>
                <td className="py-3 px-4 text-ink-600 line-clamp-2 max-w-xs">
                  {q.explanation || q.explanationUz}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
