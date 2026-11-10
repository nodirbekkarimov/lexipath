'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Volume2, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  ArrowRight,
  Eye,
  Brain,
  Keyboard
} from 'lucide-react';
import { useLexiPathStore } from '@/lib/data-store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function LearnSessionPage() {
  const store = useLexiPathStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [srsFeedback, setSrsFeedback] = useState<string | null>(null);

  // Take current user vocabulary or master items for learning
  const sessionQueue = store.userVocabulary.slice(0, 6).map(uv => {
    const vocab = store.vocabulary.find(v => v.id === uv.vocabId);
    return {
      userVocabId: uv.id,
      vocab: vocab || store.vocabulary[0],
    };
  });

  const currentItem = sessionQueue[currentIndex];

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.85;
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRate = (choice: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentItem) return;

    const result = store.submitReview(currentItem.userVocabId, choice);
    setSrsFeedback(`SM-2 hisobi: Keyingi takrorlash ${result.intervalDays} kundan so'ng rejalashtirildi.`);

    setTimeout(() => {
      if (currentIndex + 1 < sessionQueue.length) {
        setCurrentIndex((prev) => prev + 1);
        setIsRevealed(false);
        setSrsFeedback(null);
      } else {
        setIsFinished(true);
      }
    }, 800);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRevealed(prev => !prev);
      } else if (isRevealed) {
        if (e.key === '1') handleRate('again');
        if (e.key === '2') handleRate('hard');
        if (e.key === '3') handleRate('good');
        if (e.key === '4') handleRate('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed, isFinished, currentIndex]);

  if (sessionQueue.length === 0 || isFinished) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-forest-50 border border-forest-200 text-forest-700 rounded-2xl flex items-center justify-center mx-auto shadow-subtle">
          <Award className="w-8 h-8" />
        </div>
        <Badge variant="success" size="md">Session Completed</Badge>
        <h2 className="font-serif text-3xl font-bold text-ink-950">
          Ajoyib natija! (Great Progress)
        </h2>
        <p className="text-sm text-ink-600 max-w-md mx-auto leading-relaxed">
          Siz ushbu o&apos;quv siklida barcha yangi so&apos;zlarni muvaffaqiyatli o&apos;zlashtirdingiz. SM-2 algoritmi xotirani mustahkamlash uchun navbatdagi takrorlash vaqtini belgiladi.
        </p>
        <div className="pt-2 flex justify-center space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentIndex(0);
              setIsRevealed(false);
              setIsFinished(false);
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            O&apos;rganishni takrorlash
          </Button>
          <Link href="/dashboard">
            <Button variant="primary">
              Bosh sahifaga qaytish
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { vocab } = currentItem;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-xs font-semibold text-ink-600 hover:text-forest-700 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Chiqish
        </Link>
        <div className="flex items-center space-x-2">
          <Badge variant="primary" size="sm">Learn Mode</Badge>
          <span className="font-mono text-xs text-ink-600">
            {currentIndex + 1} / {sessionQueue.length}
          </span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-forest-700 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / sessionQueue.length) * 100}%` }}
        />
      </div>

      {/* Interactive Flashcard */}
      <Card className="p-8 sm:p-10 bg-white border-forest-200 shadow-elevated text-center space-y-6 min-h-[380px] flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="outline" size="sm">{vocab.cefrLevel}</Badge>
            <span className="font-mono text-xs text-ink-400 italic">{vocab.partOfSpeech}</span>
          </div>

          <div className="flex items-center justify-center space-x-3">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-ink-950 tracking-tight">
              {vocab.lemma}
            </h2>
            <button
              onClick={() => handleSpeak(vocab.lemma)}
              className="p-2 rounded-full text-ink-500 hover:text-forest-700 hover:bg-forest-50 transition"
              title="Listen pronunciation"
              aria-label="Listen pronunciation"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <p className="font-mono text-sm text-ink-500">{vocab.pronunciationIpa}</p>

          {/* Hidden or Revealed State */}
          {!isRevealed ? (
            <div className="pt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsRevealed(true)}
                className="shadow-subtle hover:bg-forest-50 hover:text-forest-800"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ma&apos;nosini ko&apos;rsatish (Space)
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-4 border-t border-ivory-200 animate-in fade-in duration-200">
              {/* Uzbek Translation */}
              <div className="bg-sage-50 border border-sage-200 rounded-xl p-3.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-forest-700 font-bold block mb-1">
                  O&apos;zbekcha Tarjimasi
                </span>
                <p className="font-serif text-xl font-bold text-ink-950">
                  {vocab.translationUz}
                </p>
              </div>

              {/* Definition */}
              <p className="text-xs text-ink-700 max-w-md mx-auto leading-relaxed">
                {vocab.definitionEn}
              </p>

              {/* Authentic Context */}
              {vocab.contextSentence && (
                <p className="font-serif italic text-xs text-ink-600 bg-ivory-50 p-3 rounded-lg border border-ivory-200 max-w-lg mx-auto">
                  &ldquo;{vocab.contextSentence}&rdquo;
                </p>
              )}
            </div>
          )}
        </div>

        {/* Rating Controls when Revealed */}
        {isRevealed && (
          <div className="space-y-3 pt-4 border-t border-ivory-200">
            {srsFeedback ? (
              <p className="text-xs font-mono text-forest-800 font-semibold animate-pulse">
                {srsFeedback}
              </p>
            ) : (
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase text-ink-400 block">
                  Qanchalik oson esladingiz? (Klaviaturadan 1-4 bosing)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleRate('again')}
                    className="p-2.5 rounded-lg border border-terracotta-200 bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-800 text-xs font-medium transition"
                  >
                    <span className="block font-bold">Qayta (1)</span>
                    <span className="text-[10px] opacity-80">&lt; 1 kun</span>
                  </button>
                  <button
                    onClick={() => handleRate('hard')}
                    className="p-2.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium transition"
                  >
                    <span className="block font-bold">Qiyin (2)</span>
                    <span className="text-[10px] opacity-80">1 kun</span>
                  </button>
                  <button
                    onClick={() => handleRate('good')}
                    className="p-2.5 rounded-lg border border-forest-200 bg-sage-50 hover:bg-sage-100 text-forest-800 text-xs font-medium transition"
                  >
                    <span className="block font-bold">Yaxshi (3)</span>
                    <span className="text-[10px] opacity-80">3 kun</span>
                  </button>
                  <button
                    onClick={() => handleRate('easy')}
                    className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-medium transition"
                  >
                    <span className="block font-bold">Oson (4)</span>
                    <span className="text-[10px] opacity-80">7 kun</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Keyboard Hint */}
      <div className="text-center text-xs font-mono text-ink-400 flex items-center justify-center space-x-2">
        <Keyboard className="w-3.5 h-3.5" />
        <span>Tugmalar: [Space] ochish • [1] Qayta • [2] Qiyin • [3] Yaxshi • [4] Oson</span>
      </div>
    </div>
  );
}
