'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  RotateCcw, 
  Eye, 
  CheckCircle2, 
  Volume2, 
  Clock, 
  Award, 
  ArrowRight,
  Keyboard
} from 'lucide-react';
import { useReview } from '@/hooks/useReview';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ReviewQueuePage() {
  const {
    queue,
    currentCard,
    currentIndex,
    totalCards,
    isRevealed,
    revealCard,
    submitRating,
    isSessionFinished,
    reviewedCount,
    lastFeedback,
    restartSession,
  } = useReview();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSessionFinished) return;
      if (e.code === 'Space') {
        e.preventDefault();
        revealCard();
      } else if (isRevealed) {
        if (e.key === '1') submitRating('again');
        if (e.key === '2') submitRating('hard');
        if (e.key === '3') submitRating('good');
        if (e.key === '4') submitRating('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed, isSessionFinished, revealCard, submitRating]);

  if (totalCards === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-forest-50 border border-forest-200 text-forest-700 rounded-2xl flex items-center justify-center mx-auto shadow-subtle">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <Badge variant="success" size="md">Hozircha bo&apos;sh</Badge>
        <h2 className="font-serif text-3xl font-bold text-ink-950">
          Bugungi takrorlashlar tugadi!
        </h2>
        <p className="text-sm text-ink-600 max-w-md mx-auto leading-relaxed">
          Bugun takrorlanishi kerak bo&apos;lgan barcha so&apos;zlar ko&apos;rib chiqildi. Yangi so&apos;zlar qo&apos;shish uchun mutolaa qiling yoki mashqlar orqali bilimingizni sinab ko&apos;ring.
        </p>
        <div className="pt-2 flex justify-center space-x-3">
          <Link href="/reading">
            <Button variant="outline">Mutolaaga o&apos;tish</Button>
          </Link>
          <Link href="/practice">
            <Button variant="primary">Mashq qilish</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isSessionFinished) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-forest-50 border border-forest-200 text-forest-700 rounded-2xl flex items-center justify-center mx-auto shadow-subtle">
          <Award className="w-8 h-8" />
        </div>
        <Badge variant="success" size="md">SM-2 Spaced Repetition Complete</Badge>
        <h2 className="font-serif text-3xl font-bold text-ink-950">
          Takrorlash muvaffaqiyatli yakunlandi!
        </h2>
        <p className="text-sm text-ink-600 max-w-md mx-auto leading-relaxed">
          Siz <strong className="text-forest-800">{reviewedCount} ta akademik so&apos;z</strong>ni SM-2 algoritmi orqali qayta takrorladingiz. Xotirada saqlash samaradorligi oshirildi.
        </p>
        <div className="pt-2 flex justify-center space-x-3">
          <Button variant="outline" onClick={restartSession}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Qayta takrorlash
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

  const { vocab } = currentCard!;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-xs font-semibold text-ink-600 hover:text-forest-700 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Dashboard
        </Link>
        <div className="flex items-center space-x-2">
          <Badge variant="warning" size="sm">
            <Clock className="w-3 h-3 mr-1 inline" /> Due Queue
          </Badge>
          <span className="font-mono text-xs text-ink-600">
            {currentIndex + 1} / {totalCards}
          </span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-forest-700 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
        />
      </div>

      {/* Review Flashcard */}
      <Card className="p-8 sm:p-10 bg-white border-forest-200 shadow-elevated text-center space-y-6 min-h-[400px] flex flex-col justify-between">
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

          {!isRevealed ? (
            <div className="pt-10">
              <Button
                variant="outline"
                size="lg"
                onClick={revealCard}
                className="shadow-subtle hover:bg-forest-50 hover:text-forest-800"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ma&apos;nosini ko&apos;rsatish (Space)
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-4 border-t border-ivory-200 animate-in fade-in duration-200">
              <div className="bg-sage-50 border border-sage-200 rounded-xl p-3.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-forest-700 font-bold block mb-1">
                  O&apos;zbekcha Tarjimasi
                </span>
                <p className="font-serif text-xl font-bold text-ink-950">
                  {vocab.translationUz}
                </p>
              </div>

              <p className="text-xs text-ink-700 max-w-md mx-auto leading-relaxed">
                {vocab.definitionEn}
              </p>

              {vocab.contextSentence && (
                <p className="font-serif italic text-xs text-ink-600 bg-ivory-50 p-3 rounded-lg border border-ivory-200 max-w-lg mx-auto">
                  &ldquo;{vocab.contextSentence}&rdquo;
                </p>
              )}
            </div>
          )}
        </div>

        {/* SRS Rating Actions */}
        {isRevealed && (
          <div className="space-y-3 pt-4 border-t border-ivory-200">
            {lastFeedback ? (
              <p className="text-xs font-mono text-forest-800 font-semibold animate-pulse">
                {lastFeedback}
              </p>
            ) : (
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase text-ink-400 block">
                  Qanchalik eslay oldingiz? (Klaviaturadan 1-4 bosing)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => submitRating('again')}
                    className="p-2.5 rounded-lg border border-terracotta-200 bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-800 text-xs font-medium transition"
                  >
                    <span className="block font-bold">Qayta (1)</span>
                    <span className="text-[10px] opacity-80">&lt; 1 kun</span>
                  </button>
                  <button
                    onClick={() => submitRating('hard')}
                    className="p-2.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium transition"
                  >
                    <span className="block font-bold">Qiyin (2)</span>
                    <span className="text-[10px] opacity-80">+1 kun</span>
                  </button>
                  <button
                    onClick={() => submitRating('good')}
                    className="p-2.5 rounded-lg border border-forest-200 bg-sage-50 hover:bg-sage-100 text-forest-800 text-xs font-medium transition"
                  >
                    <span className="block font-bold">Yaxshi (3)</span>
                    <span className="text-[10px] opacity-80">+3 kun</span>
                  </button>
                  <button
                    onClick={() => submitRating('easy')}
                    className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-medium transition"
                  >
                    <span className="block font-bold">Oson (4)</span>
                    <span className="text-[10px] opacity-80">+7 kun</span>
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
