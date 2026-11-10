import { CEFRLevel, PartOfSpeech } from '@/types/database';
import { ACADEMIC_WORDS_DB } from '@/lib/dictionary/academic-lexicon';

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
  'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
  'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while',
  'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll',
  'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'also', 'just', 'well', 'like', 'even', 'one',
  'two', 'first', 'new', 'good', 'day', 'time', 'year', 'people', 'way', 'make', 'see', 'get', 'know', 'take',
  'come', 'think', 'look', 'want', 'give', 'use', 'find', 'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave',
  'call', 'many', 'much', 'still', 'say', 'said', 'went', 'back', 'go', 'going', 'came', 'show', 'need', 'large',
  'small', 'long', 'great', 'little', 'own', 'other', 'old', 'right', 'big', 'high', 'different', 'next', 'early',
]);

export interface ExtractedWordItem {
  lemma: string;
  originalWord: string;
  cefrLevel: CEFRLevel;
  ieltsBand: number;
  partOfSpeech: PartOfSpeech;
  contextSentence: string;
  translationUz?: string;
  definitionEn?: string;
}

export function extractAcademicWordsFromText(text: string): ExtractedWordItem[] {
  if (!text || text.trim().length < 10) return [];

  // Split into sentences for context preservation
  const sentences = text
    .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
    .split('|')
    .map(s => s.trim())
    .filter(Boolean);

  const wordsMap = new Map<string, { sentence: string; count: number }>();

  for (const sentence of sentences) {
    const rawWords = sentence.match(/[a-zA-Z]{3,}/g) || [];
    for (const w of rawWords) {
      const lower = w.toLowerCase();
      if (STOP_WORDS.has(lower)) continue;
      if (lower.length <= 3) continue;

      if (!wordsMap.has(lower)) {
        wordsMap.set(lower, { sentence, count: 1 });
      } else {
        const item = wordsMap.get(lower)!;
        item.count += 1;
      }
    }
  }

  const results: ExtractedWordItem[] = [];

  Array.from(wordsMap.entries()).forEach(([word, info]) => {
    // Check if in known academic DB
    const dbEntry = ACADEMIC_WORDS_DB[word];
    if (dbEntry) {
      results.push({
        lemma: word,
        originalWord: word,
        cefrLevel: dbEntry.cefrLevel || 'C1',
        ieltsBand: dbEntry.ieltsBand || 7.5,
        partOfSpeech: dbEntry.partOfSpeech || 'noun',
        contextSentence: info.sentence,
        translationUz: dbEntry.translationUz,
        definitionEn: dbEntry.definitionEn,
      });
      return;
    }

    // Heuristic detection of academic CEFR Level
    let cefr: CEFRLevel = 'B2';
    let band = 6.5;
    let pos: PartOfSpeech = 'noun';

    if (
      word.endsWith('tion') ||
      word.endsWith('sion') ||
      word.endsWith('ment') ||
      word.endsWith('ance') ||
      word.endsWith('ence') ||
      word.endsWith('ism')
    ) {
      cefr = 'B2';
      band = 6.5;
      pos = 'noun';
    } else if (
      word.endsWith('ous') ||
      word.endsWith('ious') ||
      word.endsWith('able') ||
      word.endsWith('ible') ||
      word.endsWith('ive') ||
      word.endsWith('al')
    ) {
      cefr = 'C1';
      band = 7.5;
      pos = 'adjective';
    } else if (word.endsWith('ly')) {
      cefr = 'B2';
      band = 6.5;
      pos = 'adverb';
    } else if (
      word.endsWith('ate') ||
      word.endsWith('ize') ||
      word.endsWith('ise') ||
      word.endsWith('ify')
    ) {
      cefr = 'C1';
      band = 7.0;
      pos = 'verb';
    }

    if (word.length >= 10) {
      cefr = cefr === 'C1' ? 'C2' : 'C1';
      band = Math.min(band + 0.5, 8.5);
    }

    results.push({
      lemma: word,
      originalWord: word,
      cefrLevel: cefr,
      ieltsBand: band,
      partOfSpeech: pos,
      contextSentence: info.sentence,
    });
  });

  // Sort by CEFR level (C2 -> C1 -> B2 -> B1) and word length
  const levelWeight: Record<CEFRLevel, number> = {
    C2: 4,
    C1: 3,
    B2: 2,
    B1: 1,
  };

  return results.sort((a, b) => {
    const diff = (levelWeight[b.cefrLevel] || 0) - (levelWeight[a.cefrLevel] || 0);
    if (diff !== 0) return diff;
    return b.lemma.length - a.lemma.length;
  });
}
