import { OFFLINE_DICTIONARY } from './offline-words';

const cleanHtmlTags = (t: string) =>
  t.replace(/<[^>]*>/g, '').replace(/:\s*$/, '').trim();

/**
 * Universal multi-engine English-to-Uzbek translation service.
 * Designed for high uptime, 0ms offline lookups, and fast zero-cost fallbacks.
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
    lower.replace(/tion$/, ''),
    lower.replace(/able$/, ''),
  ];
  for (const stem of stemCandidates) {
    if (stem && stem.length >= 3 && stem !== lower && OFFLINE_DICTIONARY[stem]) {
      return OFFLINE_DICTIONARY[stem];
    }
  }

  // Tier 2: Google Translate GTX Engine (Fast, Free, Highly Accurate for Uzbek)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uz&dt=t&q=${encodeURIComponent(clean)}`,
      {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': '*/*',
        },
      }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const combined = data[0].map((item: any) => item[0]).filter(Boolean).join('');
        const trans = cleanHtmlTags(combined);
        if (trans && trans.toLowerCase() !== lower) {
          return trans;
        }
      }
    }
  } catch (err: any) {
    // Failover to Tier 3
  }

  // Tier 3: Chrome Extension Dictionary Translation API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(
      `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=uz&q=${encodeURIComponent(clean)}`,
      {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': '*/*',
        },
      }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0] && typeof data[0] === 'string') {
        const trans = cleanHtmlTags(data[0]);
        if (trans && trans.toLowerCase() !== lower) {
          return trans;
        }
      }
    }
  } catch (err: any) {
    // Failover to Tier 4
  }

  // Tier 4: MyMemory Translation API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|uz`,
      {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const transRaw = data?.responseData?.translatedText || '';
      const trans = cleanHtmlTags(transRaw);
      if (trans && trans.toLowerCase() !== lower && !trans.includes('MYMEMORY')) {
        return trans;
      }
    }
  } catch (err: any) {
    // All online fallbacks failed
  }

  return '';
}
