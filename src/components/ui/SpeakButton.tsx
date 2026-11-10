'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface SpeakButtonProps {
  text: string;
  audioUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function SpeakButton({
  text,
  audioUrl,
  className = '',
  size = 'md',
  label,
}: SpeakButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isPlaying) return;

    // 1. Try HTML5 Audio if audioUrl exists
    if (audioUrl && audioUrl.startsWith('http')) {
      try {
        setIsPlaying(true);
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          fallbackSpeech();
        };
        audio.play().catch(() => fallbackSpeech());
        return;
      } catch (err) {
        fallbackSpeech();
        return;
      }
    }

    // 2. Web Speech API fallback
    fallbackSpeech();
  };

  const fallbackSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlaying(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB'; // British English for IELTS
      utterance.rate = 0.9; // Slightly slower, clear academic pronunciation
      
      const voices = window.speechSynthesis.getVoices();
      const britishVoice = voices.find(v => v.lang === 'en-GB' || v.name.includes('British') || v.name.includes('UK'));
      if (britishVoice) {
        utterance.voice = britishVoice;
      }

      setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlaying(false);
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const iconSizes = {
    sm: 13,
    md: 16,
    lg: 20,
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      title={`Listen to pronunciation of "${text}"`}
      aria-label={`Listen to pronunciation of "${text}"`}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 border border-[#18231F]/10 hover:border-[#315C4A]/40 bg-white hover:bg-[#DCE9DF]/40 text-[#315C4A] shadow-xs active:scale-95 ${sizeClasses[size]} ${
        isPlaying ? 'ring-2 ring-[#315C4A]/40 text-[#315C4A] scale-105 bg-[#DCE9DF]/60' : ''
      } ${className}`}
    >
      <Volume2
        size={iconSizes[size]}
        className={`transition-transform duration-200 ${isPlaying ? 'animate-pulse scale-110' : ''}`}
      />
      {label && <span className="ml-1.5 font-medium">{label}</span>}
    </button>
  );
}
