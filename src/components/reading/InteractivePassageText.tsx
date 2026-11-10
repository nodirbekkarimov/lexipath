'use client';

import React from 'react';
import { VocabularyItem } from '@/types/database';

interface InteractivePassageTextProps {
  content: string;
  targetVocab: VocabularyItem[];
  selectedWord: string | null;
  onSelectWord: (word: string, contextSentence: string, vocabItem?: VocabularyItem) => void;
}

export function InteractivePassageText({
  content,
  targetVocab,
  selectedWord,
  onSelectWord,
}: InteractivePassageTextProps) {
  // Split into paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);

  // Helper to find full sentence where the word was clicked
  const findSentence = (paragraph: string, word: string) => {
    const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
    const match = sentences.find(s => s.toLowerCase().includes(word.toLowerCase()));
    return match ? match.trim() : paragraph;
  };

  const renderParagraph = (para: string, pIndex: number) => {
    // Break paragraph by space / punctuation, retaining delimiters
    const tokens = para.split(/(\s+|[.,;!?"'()[\]{}]+)/);

    return (
      <p key={pIndex} className="font-serif text-base sm:text-lg text-[#18231F] leading-relaxed sm:leading-loose mb-6">
        {tokens.map((chunk, wIndex) => {
          // Clean punctuation from word chunk for matching
          const cleanWord = chunk.toLowerCase().replace(/[^a-z-]/g, '');

          if (!cleanWord || cleanWord.length < 2) {
            return <span key={wIndex}>{chunk}</span>;
          }

          // Check if this chunk matches any target vocabulary
          const matchedVocab = targetVocab.find(v => {
            const lemmaClean = v.lemma.toLowerCase();
            return cleanWord === lemmaClean || (lemmaClean.length > 5 && cleanWord.startsWith(lemmaClean.slice(0, 5)));
          });

          const isSelected = selectedWord?.toLowerCase() === cleanWord || (matchedVocab && selectedWord?.toLowerCase() === matchedVocab.lemma.toLowerCase());

          if (matchedVocab) {
            return (
              <span
                key={wIndex}
                onClick={() => onSelectWord(cleanWord, findSentence(para, cleanWord), matchedVocab)}
                className={`cursor-pointer inline font-medium rounded px-1 transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#315C4A] text-white shadow-xs underline decoration-[#DCE9DF]'
                    : 'text-[#315C4A] bg-[#DCE9DF]/60 hover:bg-[#DCE9DF] underline decoration-[#315C4A]/40 decoration-dotted underline-offset-4'
                }`}
                title={`IELTS leksikasi: '${matchedVocab.lemma}' (${matchedVocab.translationUz})`}
                role="button"
                tabIndex={0}
              >
                {chunk}
              </span>
            );
          }

          // For any other word with length >= 3: allow clicking to inspect & translate!
          if (cleanWord.length >= 3) {
            return (
              <span
                key={wIndex}
                onClick={() => onSelectWord(cleanWord, findSentence(para, cleanWord), undefined)}
                className={`cursor-pointer inline transition-all duration-150 rounded px-0.5 ${
                  isSelected
                    ? 'bg-[#315C4A] text-white underline'
                    : 'hover:bg-[#F7F6F0] hover:text-[#315C4A] hover:underline decoration-[#315C4A]/30'
                }`}
                title={`'${chunk}' so'zini tarjima qilish va saqlash`}
                role="button"
                tabIndex={0}
              >
                {chunk}
              </span>
            );
          }

          return <span key={wIndex}>{chunk}</span>;
        })}
      </p>
    );
  };

  return (
    <div className="prose max-w-none text-[#18231F] select-text">
      {paragraphs.map((p, idx) => renderParagraph(p, idx))}
    </div>
  );
}
