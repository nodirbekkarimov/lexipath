'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BookOpen, Plus, Eye, Edit3 } from 'lucide-react';
import { Passage } from '@/types/database';

interface PassageManageTableProps {
  passages: Passage[];
  onAddPassage: () => void;
}

export function PassageManageTable({ passages, onAddPassage }: PassageManageTableProps) {
  const [search, setSearch] = useState('');

  const filtered = passages.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border border-ivory-200 shadow-subtle overflow-hidden space-y-4 p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search passages by title or topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 text-xs rounded-lg border border-ivory-300 px-3 py-2 bg-ivory-50 focus:outline-none focus:ring-1 focus:ring-forest-600"
        />
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-mono text-ink-500">
            {filtered.length} passages
          </span>
          <Button variant="primary" size="sm" onClick={onAddPassage}>
            <Plus className="w-4 h-4 mr-1" />
            New Passage
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-ivory-100 border-b border-ivory-200 text-ink-500 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Title</th>
              <th className="py-3 px-3 font-semibold">Topic</th>
              <th className="py-3 px-3 font-semibold">Level</th>
              <th className="py-3 px-3 font-semibold">Words</th>
              <th className="py-3 px-3 font-semibold">Read Time</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-200">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-ivory-50/70 transition">
                <td className="py-3 px-4">
                  <span className="font-serif text-sm font-bold text-ink-950 block">
                    {p.title}
                  </span>
                  <span className="text-[11px] text-ink-400 line-clamp-1">{(p.content || p.contentMarkdown || '').slice(0, 70)}...</span>
                </td>
                <td className="py-3 px-3 font-mono text-ink-700">
                  {p.topic}
                </td>
                <td className="py-3 px-3">
                  <Badge variant="primary" size="sm">
                    {p.cefrLevel}
                  </Badge>
                </td>
                <td className="py-3 px-3 font-mono text-ink-600">
                  {p.wordCount}
                </td>
                <td className="py-3 px-3 font-mono text-ink-600">
                  {p.estimatedReadMinutes} mins
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Link
                      href={`/reading/${p.id}`}
                      className="p-1.5 rounded text-ink-500 hover:text-forest-700 hover:bg-forest-50"
                      title="Preview Learner View"
                      aria-label="Preview passage"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
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
