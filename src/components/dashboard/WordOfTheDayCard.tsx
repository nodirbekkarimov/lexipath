'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, Volume2, Bookmark, Check, ArrowRight } from 'lucide-react';
import { useLexiPathStore } from '@/lib/data-store';

export function WordOfTheDayCard() {
  const store = useLexiPathStore();
  const [saved, setSaved] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // Pick a featured C1/C2 academic word (e.g., "unequivocal" or first C1)
  const featuredWord = store.vocabulary.find(v => v.lemma.toLowerCase() === 'unequivocal') || store.vocabulary[0];

  if (!featuredWord) return null;

  const isAlreadyInVault = store.userVocabulary.some(uv => uv.vocabId === featuredWord.id);

  const handleSpeak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(featuredWord.lemma);
      utterance.lang = 'en-GB';
      utterance.rate = 0.85;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSaveToVault = () => {
    if (isAlreadyInVault) return;
    store.addWord(
      {
        lemma: featuredWord.lemma,
        partOfSpeech: featuredWord.partOfSpeech,
        cefrLevel: featuredWord.cefrLevel,
        definitionEn: featuredWord.definitionEn,
        translationUz: featuredWord.translationUz,
        pronunciationIpa: featuredWord.pronunciationIpa,
        ieltsTopic: featuredWord.ieltsTopic,
        contextSentence: featuredWord.contextSentence,
      },
      featuredWord.contextSentence,
      'IELTS Academic'
    );
    setSaved(true);
  };

  return (
    <Card className="p-6 flex flex-col justify-between shadow-subtle border-forest-100 bg-white">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1.5 text-forest-700">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase">
              Word of the Day
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="primary" size="sm">
              {featuredWord.cefrLevel}
            </Badge>
            <Badge variant="outline" size="sm">
              Band 8.0+
            </Badge>
          </div>
        </div>

        {/* Word and Pronunciation */}
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <h3 className="font-serif text-2xl font-bold text-ink-950 tracking-tight">
              {featuredWord.lemma}
            </h3>
            <button
              onClick={handleSpeak}
              className={`p-1.5 rounded-full border transition ${
                speaking 
                  ? 'bg-forest-100 text-forest-800 border-forest-300' 
                  : 'bg-ivory-100 hover:bg-ivory-200 text-ink-600 border-ivory-200'
              }`}
              title="Listen to British pronunciation"
              aria-label="Listen pronunciation"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-ink-500">
            <span>{featuredWord.pronunciationIpa}</span>
            <span>•</span>
            <span className="italic">{featuredWord.partOfSpeech}</span>
          </div>
        </div>

        {/* Definition & Uzbek Translation */}
        <div className="mt-4 space-y-2">
          <p className="text-xs text-ink-800 leading-relaxed">
            {featuredWord.definitionEn}
          </p>

          <div className="bg-sage-50/80 border border-sage-200/80 rounded-lg p-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-forest-700 font-bold block mb-0.5">
              O&apos;zbekcha Tarjimasi
            </span>
            <p className="text-xs font-medium text-ink-900">
              {featuredWord.translationUz}
            </p>
          </div>

          {/* Authentic Example */}
          <div className="pt-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400 block mb-0.5">
              Authentic IELTS Context
            </span>
            <p className="text-xs text-ink-600 italic bg-ivory-100 p-2.5 rounded border border-ivory-200/70">
              &ldquo;{featuredWord.contextSentence}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-ivory-200 flex items-center justify-between">
        <Link 
          href={`/vocabulary/${featuredWord.id}`}
          className="text-xs font-semibold text-forest-700 hover:text-forest-900 flex items-center"
        >
          Explore Nuances
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>

        <Button
          variant={saved || isAlreadyInVault ? 'outline' : 'primary'}
          size="sm"
          onClick={handleSaveToVault}
          disabled={saved || isAlreadyInVault}
        >
          {saved || isAlreadyInVault ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1 text-forest-600" />
              In Vault
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5 mr-1" />
              Save Word
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
