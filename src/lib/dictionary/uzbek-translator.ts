import dns from 'node:dns';
import { OFFLINE_DICTIONARY } from './offline-words';

// Prevent 5-10 second IPv6 DNS timeouts on cloud / Docker container environments
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

const cleanHtmlTags = (t: string) =>
  t.replace(/<[^>]*>/g, '').replace(/:\s*$/, '').trim();

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': '*/*',
};

/**
 * Production-Grade Bulletproof English-to-Uzbek Translation Service.
 * Works seamlessly in Docker/Cloud containers (Render, Vercel, VPS) with IPv4-first resolution,
 * multi-engine failover, and a rich offline dictionary.
 */
export async function getAccurateUzbekTranslation(wordOrPhrase: string): Promise<string> {
  const clean = wordOrPhrase.trim();
  if (!clean) return '';
  const lower = clean.toLowerCase();

  // Tier 1: Instant Offline Verified Dictionary (0ms, 100% reliable)
  if (OFFLINE_DICTIONARY[lower]) {
    return OFFLINE_DICTIONARY[lower];
  }

  // Tier 1b: Stem / Inflection matching in offline dictionary
  const stemCandidates = [
    lower.replace(/s$/, ''),
    lower.replace(/es$/, ''),
    lower.replace(/ies$/, 'y'),
    lower.replace(/ed$/, ''),
    lower.replace(/d$/, ''),
    lower.replace(/ing$/, ''),
    lower.replace(/ment$/, ''),
  ];
  for (const stem of stemCandidates) {
    if (stem && stem.length >= 3 && stem !== lower && OFFLINE_DICTIONARY[stem]) {
      return OFFLINE_DICTIONARY[stem];
    }
  }

  // Tier 2: Chrome Extension Dictionary API (Ultra-fast, ~100-200ms)
  try {
    const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=uz&q=${encodeURIComponent(clean)}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(url, { signal: ctrl.signal, headers: BROWSER_HEADERS });
    clearTimeout(timer);
    if (res.ok) {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (Array.isArray(data) && data[0] && typeof data[0] === 'string') {
          const trans = cleanHtmlTags(data[0]);
          if (trans && trans.toLowerCase() !== lower) {
            return trans;
          }
        }
      } catch {}
    }
  } catch {}

  // Tier 3: MyMemory API Fallback
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|uz&de=nodir.karimov@lexipath.uz`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(url, { signal: ctrl.signal, headers: BROWSER_HEADERS });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      const raw = data?.responseData?.translatedText || '';
      const trans = cleanHtmlTags(raw);
      if (trans && trans.toLowerCase() !== lower && !trans.includes('MYMEMORY')) {
        return trans;
      }
    }
  } catch {}

  // Tier 4: Google GTX API Fallback (with safe text parsing)
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uz&dt=t&q=${encodeURIComponent(clean)}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3500);
    const res = await fetch(url, { signal: ctrl.signal, headers: BROWSER_HEADERS });
    clearTimeout(timer);
    if (res.ok) {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const combined = data[0].map((item: any) => item[0]).filter(Boolean).join('');
          const trans = cleanHtmlTags(combined);
          if (trans && trans.toLowerCase() !== lower) {
            return trans;
          }
        }
      } catch {}
    }
  } catch {}

  return '';
}
