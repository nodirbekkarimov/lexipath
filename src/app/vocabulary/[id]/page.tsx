'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Volume2, 
  BookOpen, 
  Sparkles, 
  Check, 
  Calendar, 
  Edit2, 
  Save, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Bookmark, 
  Trash2 
} from 'lucide-react';
import { useLexiPathStore } from '@/lib/data-store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ActiveOutputChallenge } from '@/components/vocabulary/ActiveOutputChallenge';
import { DeleteWordModal } from '@/components/vocabulary/DeleteWordModal';

export default function VocabularyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vocabId = (params?.id as string) || 'vocab-1';
  const store = useLexiPathStore();

  const item = store.vocabulary.find((v) => v.id === vocabId) || store.vocabulary[0];
  const userVocab = store.userVocabulary.find((uv) => uv.vocabId === item?.id);

  const [isPlaying, setIsPlaying] = useState(false);
  const [personalNote, setPersonalNote] = useState(userVocab?.personalNotes || '');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink-950">Vocabulary Item Not Found</h2>
        <Link href="/vocabulary">
          <Button variant="outline">Return to Vault</Button>
        </Link>
      </div>
    );
  }

  const handleSpeak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(item.lemma);
      utterance.lang = 'en-GB';
      utterance.rate = 0.85;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSaveNote = () => {
    if (userVocab) {
      store.updateUserWordNote(userVocab.id, personalNote);
    }
    setIsEditingNote(false);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleDelete = () => {
    if (userVocab) {
      store.deleteUserWord(userVocab.id);
      router.push('/vocabulary');
    }
  };

  const isDue = userVocab ? new Date(userVocab.dueDate) <= new Date() : false;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation Back */}
      <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
        <Link
          href="/vocabulary"
          className="inline-flex items-center text-xs font-semibold text-ink-600 hover:text-forest-700 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Vocabulary Vault
        </Link>

        {userVocab && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteModalOpen(true)}
            className="text-terracotta-700 hover:bg-terracotta-50 hover:text-terracotta-800"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Remove from Vault
          </Button>
        )}
      </div>

      {/* Hero Lexis Card */}
      <Card className="p-6 sm:p-8 bg-white border-forest-200 shadow-elevated space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink-950 tracking-tight">
                {item.lemma}
              </h1>
              <button
                onClick={handleSpeak}
                className={`p-2 rounded-full border transition ${
                  isPlaying
                    ? 'bg-forest-100 text-forest-800 border-forest-300 scale-105'
                    : 'bg-ivory-100 hover:bg-ivory-200 text-ink-600 border-ivory-200'
                }`}
                title="Pronounce British RP"
                aria-label="Listen pronunciation"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-3 mt-2 text-sm font-mono text-ink-500">
              <span className="font-semibold">{item.pronunciationIpa}</span>
              <span>•</span>
              <span className="italic">{item.partOfSpeech}</span>
              <span>•</span>
              <span className="text-forest-700 font-semibold">{item.ieltsTopic || 'Academic Lexis'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="primary" size="lg">
              CEFR {item.cefrLevel}
            </Badge>
            {userVocab ? (
              <Badge variant="success" size="lg">
                {userVocab.status.toUpperCase()}
              </Badge>
            ) : (
              <Badge variant="outline" size="lg">
                Not in Vault
              </Badge>
            )}
          </div>
        </div>

        {/* Uzbek Translation Spotlight */}
        <div className="bg-sage-50/90 border border-sage-200 rounded-xl p-4 sm:p-5">
          <span className="text-xs font-mono uppercase tracking-wider text-forest-800 font-bold block mb-1">
            O&apos;zbekcha Tarjimasi & Semantik Ma&apos;nosi
          </span>
          <p className="font-serif text-xl sm:text-2xl font-bold text-ink-950 leading-snug">
            {item.translationUz}
          </p>
        </div>

        {/* English Academic Definition */}
        <div className="space-y-1.5">
          <span className="text-xs font-mono uppercase tracking-wider text-ink-400 font-semibold block">
            Academic Definition
          </span>
          <p className="text-base text-ink-800 leading-relaxed">
            {item.definitionEn}
          </p>
        </div>

        {/* Authentic IELTS Context */}
        {item.contextSentence && (
          <div className="space-y-1.5 pt-2 border-t border-ivory-200">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-400 font-semibold block">
              Authentic IELTS Reading Context
            </span>
            <p className="font-serif italic text-sm sm:text-base text-ink-800 bg-ivory-50 p-4 rounded-xl border border-ivory-200/80 leading-relaxed">
              &ldquo;{item.contextSentence}&rdquo;
            </p>
          </div>
        )}

        {/* Collocations */}
        {item.collocations && item.collocations.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-ivory-200">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-500 font-semibold block">
              High-Frequency IELTS Collocations:
            </span>
            <div className="flex flex-wrap gap-2">
              {item.collocations.map((col, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono bg-ivory-100 border border-ivory-200 text-ink-800 px-2.5 py-1 rounded-md"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Spaced Repetition & Personal Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SRS Memory Status */}
        <Card className="p-6 bg-white border-ivory-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-forest-700" />
              <h3 className="font-serif text-lg font-bold text-ink-950">
                SM-2 Spaced Repetition
              </h3>
            </div>
            {isDue && (
              <Badge variant="warning" size="sm">Due for Review</Badge>
            )}
          </div>

          {userVocab ? (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-ivory-100">
                <span className="text-ink-500">Repetition Count</span>
                <span className="font-mono font-bold text-ink-900">{userVocab.repetitionCount} reviews</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-ivory-100">
                <span className="text-ink-500">Current Interval</span>
                <span className="font-mono font-bold text-ink-900">{userVocab.intervalDays} days</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-ivory-100">
                <span className="text-ink-500">Next Due Date</span>
                <span className="font-mono font-bold text-forest-800">{userVocab.dueDate}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-ink-500">Ease Factor</span>
                <span className="font-mono font-bold text-ink-900">{userVocab.easeFactor.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-ink-500 space-y-2">
              <p>This word is not currently tracked in your spaced repetition memory schedule.</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => store.addWord(item, item.contextSentence)}
              >
                <Bookmark className="w-3.5 h-3.5 mr-1.5" />
                Add to My Vault
              </Button>
            </div>
          )}
        </Card>

        {/* Personal Study Notes */}
        <Card className="p-6 bg-white border-ivory-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
            <div className="flex items-center space-x-2">
              <Edit2 className="w-4 h-4 text-forest-700" />
              <h3 className="font-serif text-lg font-bold text-ink-950">
                Personal Study Notes
              </h3>
            </div>
            {noteSaved && (
              <span className="text-xs text-forest-700 font-semibold flex items-center">
                <Check className="w-3.5 h-3.5 mr-1" /> Saved
              </span>
            )}
          </div>

          <div className="space-y-3">
            <textarea
              rows={4}
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder="Jot down mnemonics, Uzbek associations, or essay ideas for this word..."
              className="w-full rounded-lg border border-ivory-300 p-3 text-xs text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-1 focus:ring-forest-600 bg-ivory-50/50"
            />
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleSaveNote}>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save Personal Note
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Output Challenge */}
      <ActiveOutputChallenge vocab={item} />

      {/* Delete Word Modal */}
      <DeleteWordModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        lemma={item.lemma}
      />
    </div>
  );
}
