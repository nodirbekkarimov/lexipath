'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Lightbulb, 
  Loader2, 
  HelpCircle,
  BookOpen,
  Info
} from 'lucide-react';
import { VocabularyItem } from '@/types/database';
import { EvaluationResult } from '@/app/api/ai/evaluate-sentence/route';

interface ActiveOutputChallengeProps {
  vocab: VocabularyItem;
}

export function ActiveOutputChallenge({ vocab }: ActiveOutputChallengeProps) {
  const [learnerSentence, setLearnerSentence] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEvaluate = async () => {
    if (!learnerSentence.trim()) return;

    setIsEvaluating(true);
    setEvaluation(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/evaluate-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetWord: vocab.lemma,
          sentence: learnerSentence.trim(),
          targetPartOfSpeech: vocab.partOfSpeech || vocab.pos,
        }),
      });

      if (!res.ok) {
        throw new Error('Baholash xizmatida xatolik yuz berdi');
      }

      const json = await res.json();
      if (json.data) {
        setEvaluation(json.data);
      } else {
        throw new Error(json.error || 'Noma\'lum xatolik');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Tarmoqqa ulanishda xatolik');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-white via-sage-50/20 to-ivory-50 border-forest-200 shadow-subtle space-y-4">
      {/* Challenge Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-forest-700 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-ink-950">
              Active Output Challenge
            </h3>
            <p className="text-xs text-ink-500">
              <strong className="text-forest-800">{vocab.lemma}</strong> so&apos;zidan foydalanib mustaqil gap tuzing.
            </p>
          </div>
        </div>

        <Badge variant="primary" size="sm">
          Writing &amp; Collocation Practice
        </Badge>
      </div>

      {/* Input Textarea */}
      <div className="space-y-2">
        <label className="block text-xs font-mono uppercase tracking-wider text-ink-700 font-semibold">
          Sizning Inglizcha Jumlangiz:
        </label>
        <textarea
          rows={3}
          value={learnerSentence}
          onChange={(e) => setLearnerSentence(e.target.value)}
          placeholder={`Masalan: Research demonstrates that ${vocab.lemma} significantly impacts academic achievement...`}
          className="w-full rounded-xl border border-ivory-300 bg-white p-3.5 text-sm text-ink-900 placeholder-ink-400 focus:border-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-600"
        />
      </div>

      {/* Action and Tip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <span className="text-xs text-ink-500 flex items-center">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 mr-1.5 shrink-0" />
          <span>IELTS Writing Task 2 yoki Speaking Part 3 uslubida jumlalar tuzishga harakat qiling.</span>
        </span>

        <Button
          variant="primary"
          onClick={handleEvaluate}
          disabled={!learnerSentence.trim() || isEvaluating}
          className="cursor-pointer shrink-0"
        >
          {isEvaluating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span>Baholanmoqda...</span>
            </>
          ) : (
            <>
              <span>Tekshirish &amp; Tahlil</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </>
          )}
        </Button>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Genuine Linguistic / AI Feedback Result */}
      {evaluation && (
        <div className="mt-4 p-5 rounded-xl border border-forest-200 bg-white shadow-elevated space-y-4 animate-in fade-in-50 duration-200">
          {/* Top badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ivory-200 pb-3">
            <div className="flex items-center space-x-2">
              {evaluation.targetWordUsedCorrectly ? (
                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Maqsadli so&apos;z to&apos;g&apos;ri qo&apos;llandi</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>So&apos;z aniqlanmadi yoki shakli noto&apos;g&apos;ri</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-forest-50 border border-forest-200 text-forest-800 font-bold uppercase">
                {evaluation.academicRegister === 'formal_academic' ? 'Akademik Uslub' : 'Oddiy Uslub'}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                evaluation.grammaticalAccuracy === 'high' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                evaluation.grammaticalAccuracy === 'moderate' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                'bg-red-50 text-red-800 border border-red-200'
              }`}>
                Grammatika: {evaluation.grammaticalAccuracy}
              </span>
            </div>
          </div>

          {/* Qualitative English Feedback */}
          <p className="text-xs text-ink-900 leading-relaxed font-medium">
            {evaluation.qualitativeFeedback}
          </p>

          {/* Detailed Uzbek Pedagogical Coaching */}
          <div className="bg-sage-50/70 p-3.5 rounded-lg border border-sage-200/80 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-forest-800 font-bold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-forest-700" />
              <span>O&apos;qituvchi Tavsiyasi (O&apos;zbek tilida):</span>
            </span>
            <p className="text-xs text-ink-800 leading-relaxed">
              {evaluation.explanationUz}
            </p>
          </div>

          {/* Detected Mistakes if any */}
          {evaluation.detectedMistakes && evaluation.detectedMistakes.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-terracotta-700 font-bold block">
                Tuzatilishi kerak bo&apos;lgan jihatlar:
              </span>
              <ul className="text-xs text-ink-700 space-y-0.5 list-disc pl-4">
                {evaluation.detectedMistakes.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Model Advanced Sentence */}
          <div className="pt-2 border-t border-ivory-200 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-forest-700 font-bold block">
              IELTS C1/C2 Namuna Shakli:
            </span>
            <p className="text-xs font-serif italic text-ink-900 bg-ivory-50 p-2.5 rounded-lg border border-ivory-200">
              &ldquo;{evaluation.improvedAcademicExample}&rdquo;
            </p>
          </div>

          {/* Suggested Collocations */}
          {evaluation.suggestedCollocations && evaluation.suggestedCollocations.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-ink-500 uppercase">Tavsiya kollokatsiyalar:</span>
              {evaluation.suggestedCollocations.map((col, i) => (
                <span key={i} className="text-[11px] font-mono bg-ivory-100 text-forest-800 px-2 py-0.5 rounded border border-ivory-300">
                  {col}
                </span>
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <div className="pt-2 border-t border-ivory-100 flex items-center gap-1.5 text-[10px] text-ink-400">
            <Info className="w-3 h-3 text-ink-400 shrink-0" />
            <span>
              Manba: {evaluation.evaluationSource === 'gemini_ai' ? 'Google Gemini AI Lingvistik Tahlili' : 'Deterministik Grammatik Tahlilchi'}. Rasmiy IELTS balli hisoblanmaydi.
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
