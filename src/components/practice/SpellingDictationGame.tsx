'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SpeakButton } from '@/components/ui/SpeakButton';
import { VocabularyItem } from '@/types/database';
import { Volume2, CheckCircle, XCircle, RotateCcw, ArrowRight, Sparkles, Award } from 'lucide-react';

interface SpellingDictationGameProps {
  vocabularyList: VocabularyItem[];
  onComplete?: (score: number) => void;
}

const DEFAULT_TRICKY_WORDS: Partial<VocabularyItem>[] = [
  {
    lemma: 'accommodation',
    word: 'accommodation',
    cefrLevel: 'B2',
    ieltsBand: 6.5,
    phoneticIpa: '/əˌkɒm.əˈdeɪ.ʃən/',
    translationUz: 'Turar joy, mehmonxona yoki yashash joyi',
    definitionEn: 'A room, group of rooms, or building in which someone may live or stay.',
  },
  {
    lemma: 'hierarchy',
    word: 'hierarchy',
    cefrLevel: 'C1',
    ieltsBand: 7.5,
    phoneticIpa: '/ˈhaɪə.rɑː.ki/',
    translationUz: 'Ierarxiya, pog\'onama-pog\'ona boshqaruv tizimi',
    definitionEn: 'A system in which members of an organization or society are ranked according to relative status.',
  },
  {
    lemma: 'phenomenon',
    word: 'phenomenon',
    cefrLevel: 'B2',
    ieltsBand: 7.0,
    phoneticIpa: '/fəˈnɒm.ɪ.nən/',
    translationUz: 'Hodisa, favqulodda noyob voqelik',
    definitionEn: 'A fact or situation that is observed to exist or happen, especially one whose cause is in question.',
  },
  {
    lemma: 'occurrence',
    word: 'occurrence',
    cefrLevel: 'C1',
    ieltsBand: 7.5,
    phoneticIpa: '/əˈkʌr.əns/',
    translationUz: 'Sodir bo\'lish, yuz berish, hodisa',
    definitionEn: 'An incident or event; the fact or frequency of something happening.',
  },
  {
    lemma: 'resilient',
    word: 'resilient',
    cefrLevel: 'C1',
    ieltsBand: 7.5,
    phoneticIpa: '/rɪˈzɪl.i.ənt/',
    translationUz: 'Chidamli, bardoshli, qayta tiklanuvchan',
    definitionEn: 'Able to withstand or recover quickly from difficult conditions.',
  },
  {
    lemma: 'ubiquitous',
    word: 'ubiquitous',
    cefrLevel: 'C2',
    ieltsBand: 8.5,
    phoneticIpa: '/juːˈbɪk.wɪ.təs/',
    translationUz: 'Hamma yerda hoziru-nozir, keng tarqalgan',
    definitionEn: 'Present, appearing, or found everywhere simultaneously.',
  },
];

export function SpellingDictationGame({ vocabularyList, onComplete }: SpellingDictationGameProps) {
  const pool = vocabularyList.length >= 3 ? vocabularyList : (DEFAULT_TRICKY_WORDS as VocabularyItem[]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const currentWord = pool[currentIndex % pool.length];
  const targetLemma = (currentWord.lemma || currentWord.word || '').toLowerCase().trim();

  // Focus input on word change
  useEffect(() => {
    setUserInput('');
    setIsChecked(false);
    setIsCorrect(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isChecked) return;

    const cleanInput = userInput.toLowerCase().trim();
    const correct = cleanInput === targetLemma;

    setIsChecked(true);
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= Math.min(pool.length, 10)) {
      setGameFinished(true);
      if (onComplete) onComplete(score);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setGameFinished(false);
    setUserInput('');
    setIsChecked(false);
  };

  if (gameFinished) {
    const total = Math.min(pool.length, 10);
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="bg-white border border-[#18231F]/10 rounded-2xl p-8 text-center space-y-5 max-w-lg mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#DCE9DF] text-[#315C4A] flex items-center justify-center mx-auto">
          <Award size={36} />
        </div>
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#18231F]">
            Diktant yakunlandi!
          </h3>
          <p className="text-sm text-[#18231F]/60 mt-1">
            IELTS Listening imlo mashg'uloti natijasi
          </p>
        </div>

        <div className="py-4 border-y border-[#18231F]/10 flex items-center justify-around">
          <div>
            <div className="text-3xl font-serif font-bold text-[#315C4A]">{score} / {total}</div>
            <div className="text-xs text-[#18231F]/50 uppercase font-semibold">To'g'ri yozilgan</div>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-[#18231F]">{percentage}%</div>
            <div className="text-xs text-[#18231F]/50 uppercase font-semibold">Aniqlik darajasi</div>
          </div>
        </div>

        <p className="text-xs text-[#18231F]/70">
          {percentage >= 80
            ? 'Ajoyib natija! IELTS Listening Section 1 va 4 dagi imlo xatolaridan to\'liq himoyalangansiz.'
            : 'Yaxshi harakat! Qiyin akademik so\'zlarning imlosini muntazam ravishda takrorlab boring.'}
        </p>

        <Button
          variant="primary"
          onClick={handleRestart}
          className="bg-[#315C4A] hover:bg-[#18231F] text-white rounded-xl mx-auto"
        >
          <RotateCcw size={16} className="mr-1.5" /> Qayta mashq qilish
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#18231F]/10 rounded-2xl p-6 sm:p-8 max-w-xl mx-auto shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#18231F]/10 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#315C4A]">
            🎧 Tinglab Yozish Diktanti
          </span>
          <h2 className="text-base font-semibold text-[#18231F]">
            So'z: {currentIndex + 1} / {Math.min(pool.length, 10)}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm">
            Ball: {score}
          </Badge>
          <Badge variant="primary" size="sm">
            {currentWord.cefrLevel || 'C1'}
          </Badge>
        </div>
      </div>

      {/* Audio Play Center */}
      <div className="text-center py-4 space-y-3 bg-[#F7F6F0]/60 rounded-xl border border-[#18231F]/5">
        <p className="text-xs text-[#18231F]/50 uppercase tracking-wider font-semibold">
          Talaffuzni tinglang va to'g'ri yozing
        </p>

        <div className="flex justify-center items-center gap-3">
          <SpeakButton
            text={targetLemma}
            audioUrl={currentWord.audioUrl}
            size="lg"
            className="shadow-sm"
          />
        </div>

        {currentWord.translationUz && (
          <p className="text-sm font-medium text-[#18231F]/80 italic">
            🇺🇿 Ma'nosi: {currentWord.translationUz}
          </p>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#18231F]/60 mb-1.5">
            Inglizcha imlosi (Spelling)
          </label>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isChecked}
            placeholder="Eshitgan so'zingizni yozing..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            className="w-full px-4 py-3 text-lg font-mono text-center tracking-wider text-[#18231F] bg-[#F7F6F0] border border-[#18231F]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#315C4A]/40 focus:border-[#315C4A] transition-all"
          />
        </div>

        {/* Feedback Area */}
        {isChecked && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            {isCorrect ? (
              <CheckCircle className="text-emerald-600 mt-0.5 flex-shrink-0" size={20} />
            ) : (
              <XCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            )}
            <div className="space-y-1">
              <div className="font-bold text-sm">
                {isCorrect ? "Ajoyib! To'g'ri yozildi!" : "Imloda xatolik bor!"}
              </div>
              <div className="text-xs">
                To'g'ri yozilishi:{' '}
                <strong className="font-mono text-sm tracking-wider font-bold">
                  {targetLemma}
                </strong>
                <span className="font-sans ml-2 text-ink-500">
                  {currentWord.phoneticIpa || currentWord.pronunciationIpa}
                </span>
              </div>
              {!isCorrect && (
                <div className="text-xs opacity-70">
                  Siz yozganingiz: <span className="line-through font-mono">{userInput}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          {!isChecked ? (
            <Button
              type="submit"
              variant="primary"
              disabled={!userInput.trim()}
              className="w-full py-3 bg-[#315C4A] hover:bg-[#18231F] text-white rounded-xl shadow-xs"
            >
              Tekshirish
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              className="w-full py-3 bg-[#18231F] hover:bg-[#315C4A] text-white rounded-xl shadow-xs"
            >
              Keyingi so'z <ArrowRight size={16} className="ml-1.5" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
