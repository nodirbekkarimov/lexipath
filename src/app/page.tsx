'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Plus, Sparkles, FileText, Lightbulb } from 'lucide-react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { ContinueLearningHero } from '@/components/dashboard/ContinueLearningHero';
import { WeeklyActivityChart } from '@/components/dashboard/WeeklyActivityChart';
import { WordOfTheDayCard } from '@/components/dashboard/WordOfTheDayCard';
import { RecentVocabularyList } from '@/components/dashboard/RecentVocabularyList';
import { AddWordModal } from '@/components/dashboard/AddWordModal';
import { SmartTextExtractorModal } from '@/components/tools/SmartTextExtractorModal';
import { IeltsParaphraseModal } from '@/components/tools/IeltsParaphraseModal';
import { useLexiPathStore } from '@/lib/data-store';

export default function LearnerDashboard() {
  const store = useLexiPathStore();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [extractorOpen, setExtractorOpen] = useState(false);
  const [paraphraseOpen, setParaphraseOpen] = useState(false);
  const [quickWord, setQuickWord] = useState('');
  const [modalDefaultLemma, setModalDefaultLemma] = useState('');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickWord.trim()) {
      setModalDefaultLemma('');
      setAddModalOpen(true);
      return;
    }
    setModalDefaultLemma(quickWord.trim());
    setAddModalOpen(true);
    setQuickWord('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-b border-[#18231F]/10 pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#18231F]">
            {(!store.learner.email || store.learner.id === 'guest' || store.learner.email === 'learner@lexipath.uz') ? 'Xush kelibsiz!' : `Salom, ${store.learner.fullName.split(' ')[0]}`}
          </h1>
          <p className="text-sm text-[#18231F]/70 mt-1">
            Maqsad: <strong className="text-[#315C4A] font-semibold">IELTS Band {store.learner.targetBand}</strong> — SM-2 spaced repetition va haqiqiy reading konteksti bilan.
          </p>
        </div>

        {/* Quick Tools & Quick Add Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Smart Extractor Button */}
          <button
            type="button"
            onClick={() => setExtractorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white hover:bg-[#F7F6F0] text-[#18231F] border border-[#18231F]/15 rounded-xl shadow-xs transition-all"
            title="Matndan so'zlarni suzib olish"
          >
            <FileText size={14} className="text-[#315C4A]" />
            <span>Matndan ajratish</span>
          </button>

          {/* Paraphrase Booster Button */}
          <button
            type="button"
            onClick={() => setParaphraseOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white hover:bg-[#F7F6F0] text-[#18231F] border border-[#18231F]/15 rounded-xl shadow-xs transition-all"
            title="Band 8.0+ Parafraz va shablonlar"
          >
            <Lightbulb size={14} className="text-amber-500" />
            <span>Band 8.0+ Parafraz</span>
          </button>

          {/* Quick Add Input */}
          <form onSubmit={handleQuickAdd} className="relative flex items-center">
            <input
              type="text"
              value={quickWord}
              onChange={(e) => setQuickWord(e.target.value)}
              placeholder="Yangi so'z yozing (e.g. resilient)..."
              className="w-full sm:w-56 md:w-64 pl-9 pr-3.5 py-2 text-sm bg-white border border-[#18231F]/15 rounded-xl placeholder-[#18231F]/35 focus:outline-none focus:ring-2 focus:ring-[#315C4A]/30 focus:border-[#315C4A] transition-all shadow-xs"
            />
            <Sparkles className="w-4 h-4 text-[#315C4A] absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 px-2 py-0.5 text-xs font-semibold bg-[#DCE9DF] hover:bg-[#315C4A] text-[#315C4A] hover:text-white rounded-lg transition-colors"
            >
              Qo'shish
            </button>
          </form>

          <Button
            variant="primary"
            onClick={() => {
              setModalDefaultLemma('');
              setAddModalOpen(true);
            }}
            className="shadow-sm py-2 whitespace-nowrap bg-[#315C4A] hover:bg-[#18231F] text-white rounded-xl text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            Yangi So'z
          </Button>
        </div>
      </div>

      {/* Guest Mode Advisory Banner */}
      {(!store.learner.email || store.learner.id === 'guest') && (
        <div className="bg-[#DCE9DF]/50 border border-[#315C4A]/25 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2.5 text-[#18231F]">
            <span className="text-base">🚀</span>
            <span>
              <strong>Mehmon rejimi:</strong> Shaxsiy lug&apos;at va IELTS taraqqiyotingizni bulutda xavfsiz saqlash uchun bepul hisob oching yoki tizimga kiring.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/login"
              className="px-3 py-1.5 bg-white hover:bg-[#F7F6F0] text-[#18231F] border border-[#18231F]/15 font-semibold rounded-xl transition shadow-xs"
            >
              Kirish
            </Link>
            <Link
              href="/register"
              className="px-3.5 py-1.5 bg-[#315C4A] hover:bg-[#18231F] text-white font-semibold rounded-xl transition shadow-xs"
            >
              Ro&apos;yxatdan o&apos;tish
            </Link>
          </div>
        </div>
      )}

      {/* KPI Stats Overview */}
      <DashboardStats />

      {/* Hero Recommendation */}
      <ContinueLearningHero />

      {/* Main Grid: Weekly Effort & Word of the Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyActivityChart />
        </div>
        <div className="lg:col-span-1">
          <WordOfTheDayCard />
        </div>
      </div>

      {/* Secondary Section: Vocabulary Overview & Recent Acquisitions */}
      <div className="pt-4">
        <RecentVocabularyList />
      </div>

      {/* Add Word Modal */}
      <AddWordModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        defaultLemma={modalDefaultLemma}
      />

      {/* Smart Text Extractor Modal */}
      <SmartTextExtractorModal
        isOpen={extractorOpen}
        onClose={() => setExtractorOpen(false)}
      />

      {/* IELTS Paraphrase Modal */}
      <IeltsParaphraseModal
        isOpen={paraphraseOpen}
        onClose={() => setParaphraseOpen(false)}
      />
    </div>
  );
}
