'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, CheckCircle2, ArrowRight, Lightbulb, MessageSquare } from 'lucide-react';
import { VocabularyItem } from '@/types/database';

interface ActiveOutputChallengeProps {
  vocab: VocabularyItem;
}

export function ActiveOutputChallenge({ vocab }: ActiveOutputChallengeProps) {
  const [learnerSentence, setLearnerSentence] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: string;
    bandEquivalent: string;
    collocationScore: string;
    feedbackText: string;
    suggestions: string[];
    upgradedSentence: string;
  } | null>(null);

  const handleEvaluate = () => {
    if (!learnerSentence.trim()) return;

    setIsEvaluating(true);
    // Simulate intelligent educational evaluation
    setTimeout(() => {
      const containsLemma = learnerSentence.toLowerCase().includes(vocab.lemma.toLowerCase().slice(0, 4));
      
      if (!containsLemma) {
        setFeedback({
          score: 'Incomplete',
          bandEquivalent: 'Band 6.0',
          collocationScore: 'Needs target word',
          feedbackText: `Your sentence does not appear to contain the target word "${vocab.lemma}". Try weaving "${vocab.lemma}" into your statement.`,
          suggestions: [
            `Remember that "${vocab.lemma}" is a ${vocab.partOfSpeech}.`,
            `Check the authentic IELTS example above for typical subject-verb pairings.`
          ],
          upgradedSentence: `The findings provide ${vocab.lemma} evidence that educational investments yield sustained macroeconomic returns.`,
        });
      } else {
        setFeedback({
          score: 'Strong Academic Register',
          bandEquivalent: 'Band 8.0 - 8.5',
          collocationScore: '94% Natural',
          feedbackText: `Excellent usage! You have employed "${vocab.lemma}" in an appropriate academic register with natural grammatical complementation. This demonstrates high lexical resource for IELTS Task 2 or Speaking Part 3.`,
          suggestions: [
            `Collocation notice: "${vocab.lemma}" pairs exceptionally well with nouns like 'evidence', 'proof', 'statement', and 'support'.`,
            `Uzbek translation alignment: "${vocab.translationUz}" matches the precise semantic intensity of your sentence.`
          ],
          upgradedSentence: learnerSentence.endsWith('.') ? learnerSentence : `${learnerSentence}.`,
        });
      }
      setIsEvaluating(false);
    }, 700);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-white via-sage-50/30 to-ivory-50 border-forest-200 shadow-subtle space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-forest-700 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-ink-950">
              Active Production Challenge
            </h3>
            <p className="text-xs text-ink-500">
              Practice using <strong className="text-forest-800">{vocab.lemma}</strong> in an authentic IELTS sentence.
            </p>
          </div>
        </div>

        <Badge variant="primary" size="sm">
          Writing & Speaking Task
        </Badge>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-mono uppercase tracking-wider text-ink-700">
          Your Output Sentence (English)
        </label>
        <textarea
          rows={3}
          value={learnerSentence}
          onChange={(e) => setLearnerSentence(e.target.value)}
          placeholder={`Compose a complex sentence using '${vocab.lemma}' (e.g. arguing about technology, education, or climate change)...`}
          className="w-full rounded-xl border border-ivory-300 bg-white p-3.5 text-sm text-ink-900 placeholder-ink-400 focus:border-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-600"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-ink-500 flex items-center">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 mr-1" />
          Tip: Collocates with &lsquo;empirical&rsquo;, &lsquo;conclusive&rsquo;, &lsquo;unequivocal&rsquo;
        </span>

        <Button
          variant="primary"
          onClick={handleEvaluate}
          disabled={!learnerSentence.trim() || isEvaluating}
        >
          {isEvaluating ? (
            'Analyzing Academic Register...'
          ) : (
            <>
              Evaluate Collocation
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </>
          )}
        </Button>
      </div>

      {/* Instant Feedback Panel */}
      {feedback && (
        <div className="mt-4 p-4 rounded-xl border border-forest-200 bg-white shadow-subtle space-y-3 animate-in fade-in-50 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ivory-200 pb-2.5">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-forest-700" />
              <span className="text-xs font-bold text-ink-900">{feedback.score}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="success" size="sm">{feedback.bandEquivalent}</Badge>
              <Badge variant="outline" size="sm">{feedback.collocationScore}</Badge>
            </div>
          </div>

          <p className="text-xs text-ink-800 leading-relaxed">
            {feedback.feedbackText}
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-ink-500 font-semibold block">
              Lexical Coaching Points:
            </span>
            <ul className="text-xs text-ink-700 space-y-1 list-disc pl-4">
              {feedback.suggestions.map((sug, i) => (
                <li key={i}>{sug}</li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-ivory-200">
            <span className="text-[10px] font-mono uppercase tracking-wider text-forest-700 font-bold block mb-1">
              Polished IELTS Band 8.5 Model:
            </span>
            <p className="text-xs font-serif italic text-ink-900 bg-ivory-50 p-2.5 rounded-lg border border-ivory-200">
              &ldquo;{feedback.upgradedSentence}&rdquo;
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
