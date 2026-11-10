'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { useReading } from '@/hooks/useReading';
import { useLexiPathStore } from '@/lib/data-store';
import { Badge } from '@/components/ui/Badge';
import { InteractivePassageText } from '@/components/reading/InteractivePassageText';
import { WordInspectorPanel } from '@/components/reading/WordInspectorPanel';
import { ComprehensionQuestions } from '@/components/reading/ComprehensionQuestions';
import { VocabularyItem } from '@/types/database';
import { FocusReaderToolbar, ReaderTheme } from '@/components/reading/FocusReaderToolbar';

export default function ReadingWorkspacePage() {
  const params = useParams();
  const passageId = (params?.id as string) || 'pass-1';
  const store = useLexiPathStore();

  const [readerTheme, setReaderTheme] = useState<ReaderTheme>('ivory');
  const [fontSize, setFontSize] = useState<number>(18);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  const {
    currentPassage,
    targetVocab,
    selectedWord,
    selectedContext,
    selectedVocabItem,
    isCurrentWordSaved,
    handleWordSelect,
    clearSelectedWord,
    saveCurrentWordToVault,
    completePassage,
    isCompleted,
  } = useReading(passageId);

  if (!currentPassage) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink-950">Passage Not Found</h2>
        <Link href="/reading" className="text-forest-700 underline font-medium">
          Return to Reading Catalog
        </Link>
      </div>
    );
  }

  // Fallback vocabulary items for highlights if targetVocab is empty
  const activeVocab = targetVocab.length > 0 ? targetVocab : store.vocabulary;

  // Active word selection handler
  const onWordClick = (word: string, contextSentence: string, vocab?: VocabularyItem) => {
    handleWordSelect(word, contextSentence, vocab);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-ivory-200 pb-4">
        <Link
          href="/reading"
          className="inline-flex items-center text-xs font-semibold text-ink-600 hover:text-forest-700 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Reading Catalog
        </Link>

        <div className="flex items-center space-x-3 text-xs font-mono text-ink-500">
          <span className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {currentPassage.estimatedReadMinutes} mins
          </span>
          <span>•</span>
          <span>{currentPassage.wordCount} words</span>
          <span>•</span>
          <Badge variant="primary" size="sm">
            CEFR {currentPassage.cefrLevel}
          </Badge>
          {isCompleted && (
            <Badge variant="success" size="sm">
              <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Completed
            </Badge>
          )}
        </div>
      </div>

      {/* Main Reading Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Passage Content & Comprehension */}
        <div className="lg:col-span-8 space-y-8">
          {/* Passage Header */}
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-semibold">
              {currentPassage.topic}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950 leading-tight">
              {currentPassage.title}
            </h1>
          </div>

          {/* Interactive Instructions Notice */}
          <div className="bg-sage-50/70 border border-sage-200 rounded-xl p-3.5 flex items-start space-x-2.5 text-xs text-ink-700">
            <Info className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Interactive Contextual Glossing:</strong> Underlined words are academic IELTS lexis. Click any underlined word to inspect its meaning in Uzbek, hear native British audio, and add it directly to your spaced repetition vault.
            </p>
          </div>

          {/* Focus Reader Controls Toolbar */}
          <FocusReaderToolbar
            theme={readerTheme}
            setTheme={setReaderTheme}
            fontSize={fontSize}
            setFontSize={setFontSize}
            isFocusMode={isFocusMode}
            setIsFocusMode={setIsFocusMode}
          />

          {/* Reading Card with Interactive Text */}
          <div
            className={`rounded-2xl border p-6 sm:p-10 shadow-subtle transition-all duration-200 ${
              readerTheme === 'sepia'
                ? 'bg-[#FAF4EB] border-[#8C6D46]/20 text-[#3D3020]'
                : readerTheme === 'dark'
                ? 'bg-[#18231F] border-zinc-700 text-zinc-100'
                : 'bg-white border-ivory-200 text-ink-950'
            }`}
            style={{ fontSize: `${fontSize}px` }}
          >
            <InteractivePassageText
              content={currentPassage.content || currentPassage.contentMarkdown || ''}
              targetVocab={activeVocab}
              selectedWord={selectedWord}
              onSelectWord={onWordClick}
            />
          </div>

          {/* Comprehension Questions */}
          {currentPassage.questions && currentPassage.questions.length > 0 && (
            <ComprehensionQuestions
              questions={(currentPassage.questions || []).map((q) => ({
                id: q.id,
                question: q.question || q.prompt || '',
                options: q.options || [],
                correctAnswer: q.correctAnswer,
                explanation: q.explanation || q.explanationUz || '',
              }))}
              onCompletePassage={completePassage}
              isPassageCompleted={isCompleted}
            />
          )}
        </div>

        {/* Right Column: Contextual Lexis Inspector */}
        <div className="lg:col-span-4">
          {selectedWord ? (
            <WordInspectorPanel
              selectedWord={selectedWord}
              vocabItem={selectedVocabItem}
              contextSentence={selectedContext}
              isSaved={isCurrentWordSaved}
              onSaveToVault={saveCurrentWordToVault}
              onClose={clearSelectedWord}
            />
          ) : (
            <div className="sticky top-20 bg-white border border-dashed border-ivory-300 rounded-xl p-8 text-center text-ink-500 space-y-3">
              <div className="w-10 h-10 rounded-full bg-ivory-100 flex items-center justify-center mx-auto text-forest-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-base font-bold text-ink-950">
                Lexis Inspector Ready
              </h4>
              <p className="text-xs leading-relaxed max-w-xs mx-auto">
                Click any highlighted vocabulary item in the reading passage to inspect its precise definition, Uzbek translation, and save it to your vault.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
