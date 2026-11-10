'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Target, 
  Languages, 
  Volume2, 
  Download, 
  CheckCircle2, 
  Save, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useLexiPathStore } from '@/lib/data-store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

export default function SettingsPage() {
  const store = useLexiPathStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'goals' | 'audio' | 'data'>('profile');
  
  // Profile state
  const [fullName, setFullName] = useState(store.learner.fullName);
  const [targetBand, setTargetBand] = useState(String(store.learner.targetBand));
  const [dailyGoal, setDailyGoal] = useState(String(store.learner.dailyGoalWords));
  const [nativeLanguage, setNativeLanguage] = useState(store.learner.nativeLanguage);
  
  // Audio state
  const [accent, setAccent] = useState('en-GB');
  const [speechRate, setSpeechRate] = useState('0.85');

  // Feedback states
  const [savedToast, setSavedToast] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateLearnerProfile({
      fullName: fullName.trim(),
      targetBand: parseFloat(targetBand) || 7.5,
      dailyGoalWords: parseInt(dailyGoal, 10) || 10,
      nativeLanguage,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleExportData = () => {
    const exportPayload = {
      profile: store.learner,
      vocabularyVault: store.userVocabulary.map(uv => {
        const item = store.vocabulary.find(v => v.id === uv.vocabId);
        return {
          ...uv,
          vocabulary: item,
        };
      }),
      quizAttempts: store.quizAttempts,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lexipath-export-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ivory-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-ink-500 mb-1">
            <span>LexiPath</span>
            <span>/</span>
            <span className="text-forest-700">Account Preferences</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ink-950">
            Learner Settings
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            Configure learning objectives, IELTS target score, pronunciation dialect, and export personal study data.
          </p>
        </div>

        {savedToast && (
          <div className="flex items-center space-x-2 bg-forest-50 border border-forest-200 px-3 py-1.5 rounded-lg text-forest-800 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-forest-700" />
            <span>Sozlamalar muvaffaqiyatli saqlandi!</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-ivory-200 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'profile'
              ? 'bg-forest-700 text-white font-semibold shadow-xs'
              : 'text-ink-600 hover:bg-ivory-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Target</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'audio'
              ? 'bg-forest-700 text-white font-semibold shadow-xs'
              : 'text-ink-600 hover:bg-ivory-100'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>Speech & Audio</span>
        </button>

        <button
          onClick={() => setActiveTab('data')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'data'
              ? 'bg-forest-700 text-white font-semibold shadow-xs'
              : 'text-ink-600 hover:bg-ivory-100'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Data & Storage</span>
        </button>
      </div>

      {/* Tab 1: Profile & Target */}
      {activeTab === 'profile' && (
        <Card className="p-6 sm:p-8 bg-white border-ivory-200 shadow-subtle space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="border-b border-ivory-200 pb-4">
              <h3 className="font-serif text-lg font-bold text-ink-950">
                Personal Learner Profile
              </h3>
              <p className="text-xs text-ink-500">
                Adjust your personal identity and IELTS preparation benchmarks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5 font-mono">
                  Email Address (Fixed)
                </label>
                <input
                  type="text"
                  disabled
                  value={store.learner.email}
                  className="w-full rounded-lg border border-ivory-200 bg-ivory-100 px-3 py-2 text-xs text-ink-500 cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="IELTS Target Band"
                value={targetBand}
                onChange={(e) => setTargetBand(e.target.value)}
                options={[
                  { value: '6.5', label: 'Band 6.5 (Competent)' },
                  { value: '7.0', label: 'Band 7.0 (Good)' },
                  { value: '7.5', label: 'Band 7.5 (Very Good)' },
                  { value: '8.0', label: 'Band 8.0 (Superior)' },
                  { value: '8.5', label: 'Band 8.5 (Expert)' },
                ]}
              />

              <Select
                label="Daily New Words Goal"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
                options={[
                  { value: '5', label: '5 words / day (Light)' },
                  { value: '10', label: '10 words / day (Standard)' },
                  { value: '15', label: '15 words / day (Intensive)' },
                  { value: '25', label: '25 words / day (Immersion)' },
                ]}
              />

              <Select
                label="Native Language"
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                options={[
                  { value: 'uz', label: 'O\'zbek tili (Uzbek)' },
                  { value: 'ru', label: 'Русский (Russian)' },
                  { value: 'en', label: 'English' },
                ]}
              />
            </div>

            <div className="pt-4 border-t border-ivory-200 flex justify-end">
              <Button type="submit" variant="primary">
                <Save className="w-4 h-4 mr-2" />
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 2: Speech & Audio */}
      {activeTab === 'audio' && (
        <Card className="p-6 sm:p-8 bg-white border-ivory-200 shadow-subtle space-y-6">
          <div className="border-b border-ivory-200 pb-4">
            <h3 className="font-serif text-lg font-bold text-ink-950">
              Speech Synthesis Configuration
            </h3>
            <p className="text-xs text-ink-500">
              Customize native speaker dialect and articulation playback speeds for vocabulary listening.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="English Accent Dialect"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              options={[
                { value: 'en-GB', label: 'British English (RP) — IELTS Standard' },
                { value: 'en-US', label: 'General American' },
                { value: 'en-AU', label: 'Australian English' },
              ]}
            />

            <Select
              label="Audio Playback Speed"
              value={speechRate}
              onChange={(e) => setSpeechRate(e.target.value)}
              options={[
                { value: '0.75', label: '0.75x — Slow & Articulated' },
                { value: '0.85', label: '0.85x — Recommended Study Rate' },
                { value: '1.0', label: '1.0x — Natural Native Speed' },
              ]}
            />
          </div>

          <div className="p-4 bg-ivory-50 rounded-xl border border-ivory-200 flex items-center justify-between">
            <div className="text-xs text-ink-700">
              <strong>Test Audio Output:</strong> Click to preview phonetic pronunciation with chosen settings.
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance('LexiPath academic vocabulary platform');
                  utterance.lang = accent;
                  utterance.rate = parseFloat(speechRate);
                  window.speechSynthesis.speak(utterance);
                }
              }}
            >
              <Volume2 className="w-4 h-4 mr-1.5" />
              Preview Audio
            </Button>
          </div>
        </Card>
      )}

      {/* Tab 3: Data & Storage */}
      {activeTab === 'data' && (
        <Card className="p-6 sm:p-8 bg-white border-ivory-200 shadow-subtle space-y-6">
          <div className="border-b border-ivory-200 pb-4">
            <h3 className="font-serif text-lg font-bold text-ink-950">
              Data Management & Backup
            </h3>
            <p className="text-xs text-ink-500">
              Export your spaced repetition schedules and vocabulary items for local backup.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-ivory-200 bg-ivory-50">
            <div>
              <span className="font-serif font-bold text-ink-950 text-sm block">
                Export Vocabulary Vault (JSON)
              </span>
              <p className="text-xs text-ink-500">
                Download all saved words, Uzbek glosses, reading contexts, and SM-2 retention schedules.
              </p>
            </div>
            <Button variant="primary" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Download JSON Export
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-terracotta-200 bg-terracotta-50/50">
            <div>
              <span className="font-serif font-bold text-terracotta-900 text-sm block">
                Reset Local Study Cache
              </span>
              <p className="text-xs text-terracotta-700">
                Restore sample academic vocabulary dataset and clear local device modifications.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setResetModalOpen(true)}
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset Cache
            </Button>
          </div>
        </Card>
      )}

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset Study Cache"
        size="sm"
      >
        <div className="space-y-4 pt-2 text-xs text-ink-700">
          <p>
            Are you sure you want to reset your local study cache? This will restore the default academic vocabulary database and reinitialize SM-2 schedules.
          </p>
          <div className="flex justify-end space-x-2 pt-2 border-t border-ivory-200">
            <Button variant="ghost" size="sm" onClick={() => setResetModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('lexipath_storage_v1');
                  window.location.reload();
                }
              }}
            >
              Confirm Reset
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
