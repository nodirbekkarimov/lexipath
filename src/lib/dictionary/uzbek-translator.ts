import https from 'node:https';
import { OFFLINE_DICTIONARY } from './offline-words';

const cleanHtmlTags = (t: string) =>
  t.replace(/<[^>]*>/g, '').replace(/:\s*$/, '').trim();

/**
 * Robust IPv4-forced HTTPS GET for cloud container environments.
 * Prevents container IPv6 hangs on Alpine Linux / Docker / Render.
 */
function httpsGet(urlStr: string, timeoutMs = 3500): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(urlStr);
      const req = https.get(
        {
          protocol: url.protocol,
          hostname: url.hostname,
          port: url.port || 443,
          path: url.pathname + url.search,
          family: 4, // Strict IPv4 socket prevents container IPv6 hangs
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': '*/*',
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve(data);
            } else {
              reject(new Error(`Status ${res.statusCode}`));
            }
          });
        }
      );
      req.on('error', reject);
      req.setTimeout(timeoutMs, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    } catch (e) {
      reject(e);
    }
  });
}

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

  // Tier 2: Chrome Extension Dictionary API with IPv4 socket
  try {
    const raw = await httpsGet(
      `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=uz&q=${encodeURIComponent(clean)}`,
      2500
    );
    const data = JSON.parse(raw);
    if (Array.isArray(data) && data[0] && typeof data[0] === 'string') {
      const trans = cleanHtmlTags(data[0]);
      if (trans && trans.toLowerCase() !== lower) {
        return trans;
      }
    }
  } catch {}

  // Tier 3: MyMemory API Fallback with IPv4 socket
  try {
    const raw = await httpsGet(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|uz&de=nodir.karimov@lexipath.uz`,
      3000
    );
    const data = JSON.parse(raw);
    const transRaw = data?.responseData?.translatedText || '';
    const trans = cleanHtmlTags(transRaw);
    if (trans && trans.toLowerCase() !== lower && !trans.includes('MYMEMORY')) {
      return trans;
    }
  } catch {}

  // Tier 4: Google GTX with IPv4 socket
  try {
    const raw = await httpsGet(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uz&dt=t&q=${encodeURIComponent(clean)}`,
      2500
    );
    const data = JSON.parse(raw);
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const combined = data[0].map((item: any) => item[0]).filter(Boolean).join('');
      const trans = cleanHtmlTags(combined);
      if (trans && trans.toLowerCase() !== lower) {
        return trans;
      }
    }
  } catch {}

  return '';
}
