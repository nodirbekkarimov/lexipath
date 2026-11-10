import { NextRequest, NextResponse } from 'next/server';
import { 
  ACADEMIC_WORDS_DB, 
  classifyWordLevel, 
  detectPartOfSpeech, 
  EnrichedWordData,
  ParaphraseItem 
} from '@/lib/dictionary/academic-lexicon';
import { lookupParaphrase } from '@/lib/dictionary/ielts-paraphraser';
import { PartOfSpeech } from '@/types/database';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawWord = body.word || body.lemma || '';
    const rawContext = body.context || '';

    const lemma = rawWord.trim().toLowerCase();
    if (!lemma) {
      return NextResponse.json({ error: 'Word or lemma is required' }, { status: 400 });
    }

    // 1. Direct match in local Academic Lexicon Database
    if (ACADEMIC_WORDS_DB[lemma]) {
      const entry = ACADEMIC_WORDS_DB[lemma]!;
      const paraphrases: ParaphraseItem[] = [];
      const paraData = lookupParaphrase(lemma);
      if (paraData?.alternatives) {
        paraData.alternatives.forEach(alt => {
          paraphrases.push({
            word: alt.word,
            cefr: alt.cefr,
            band: alt.band,
            nuanceUz: alt.nuanceUz,
            collocation: alt.collocation,
          });
        });
      } else if (entry.synonyms && entry.synonyms.length > 0) {
        entry.synonyms.forEach(s => {
          const lvl = classifyWordLevel(s);
          paraphrases.push({
            word: s,
            cefr: lvl.cefrLevel,
            band: lvl.ieltsBand,
          });
        });
      }

      const result: EnrichedWordData = {
        lemma,
        partOfSpeech: entry.partOfSpeech || 'noun',
        cefrLevel: entry.cefrLevel || 'B2',
        ieltsBand: entry.ieltsBand || 6.5,
        phoneticIpa: entry.phoneticIpa || `/${lemma}/`,
        audioUrl: entry.audioUrl || `https://api.dictionaryapi.dev/media/pronunciations/en/${lemma}-us.mp3`,
        definitionEn: entry.definitionEn || `${lemma} meaning`,
        translationUz: entry.translationUz || `${lemma} tarjimasi`,
        uzbekContextNotes: entry.uzbekContextNotes || '',
        contextSentence: rawContext || entry.contextSentence || `The practical significance of this ${lemma} approach cannot be overstated.`,
        collocations: entry.collocations || [`${lemma} aspect`, `${lemma} impact`],
        synonyms: entry.synonyms || [],
        antonyms: entry.antonyms || [],
        topic: entry.topic || 'IELTS Academic Core',
        paraphrases,
      };
      return NextResponse.json({ success: true, data: result, source: 'lexicon_db' });
    }

    // 2. Fetch from Dictionary API for real phonetics, audio, definitions
    let dictData: any = null;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3500);
      const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(lemma)}`, {
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (dictRes.ok) {
        const json = await dictRes.json();
        if (Array.isArray(json) && json.length > 0) {
          dictData = json[0];
        }
      }
    } catch (err) {
      // Dictionary API timeout or offline — graceful fallback continues
    }

    // Extract pronunciation & audio
    let phoneticIpa = dictData?.phonetic || '';
    let audioUrl = '';
    if (Array.isArray(dictData?.phonetics)) {
      for (const p of dictData.phonetics) {
        if (!phoneticIpa && p.text) phoneticIpa = p.text;
        if (!audioUrl && p.audio && p.audio.endsWith('.mp3')) audioUrl = p.audio;
      }
    }

    // Extract meanings, POS, and definitions
    let detectedPos: PartOfSpeech = detectPartOfSpeech(lemma);
    let definitionEn = '';
    let exampleSentence = rawContext;
    const synonyms: string[] = [];
    const antonyms: string[] = [];

    if (Array.isArray(dictData?.meanings) && dictData.meanings.length > 0) {
      const firstMeaning = dictData.meanings[0];
      if (firstMeaning.partOfSpeech) {
        const p = firstMeaning.partOfSpeech.toLowerCase();
        if (p === 'verb') detectedPos = 'verb';
        else if (p === 'noun') detectedPos = 'noun';
        else if (p === 'adjective') detectedPos = 'adjective';
        else if (p === 'adverb') detectedPos = 'adverb';
      }

      if (Array.isArray(firstMeaning.definitions) && firstMeaning.definitions.length > 0) {
        definitionEn = firstMeaning.definitions[0].definition || '';
        if (!exampleSentence && firstMeaning.definitions[0].example) {
          exampleSentence = firstMeaning.definitions[0].example;
        }
      }

      if (Array.isArray(firstMeaning.synonyms)) {
        synonyms.push(...firstMeaning.synonyms.slice(0, 5));
      }
      if (Array.isArray(firstMeaning.antonyms)) {
        antonyms.push(...firstMeaning.antonyms.slice(0, 3));
      }
    }

    if (!definitionEn) {
      definitionEn = `A formal expression denoting ${lemma}.`;
    }

    if (!exampleSentence) {
      exampleSentence = `Recent investigations examine how ${lemma} influences outcomes.`;
    }

    // 3. Classify CEFR & IELTS Level
    const { cefrLevel, ieltsBand } = classifyWordLevel(lemma, detectedPos);

    // 4. Real Uzbek Translation: Google Translate (Fast) + MyMemory Fallback
    let translationUz = '';

    // Primary: Google Translate (Free fast endpoint, <400ms)
    try {
      const gtController = new AbortController();
      const gtTimer = setTimeout(() => gtController.abort(), 3500);
      const gtRes = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uz&dt=t&q=${encodeURIComponent(lemma)}`,
        { signal: gtController.signal }
      );
      clearTimeout(gtTimer);
      if (gtRes.ok) {
        const gtData = await gtRes.json();
        if (Array.isArray(gtData) && Array.isArray(gtData[0])) {
          const combined = gtData[0].map((item: any) => item[0]).filter(Boolean).join('');
          if (combined && combined.trim().toLowerCase() !== lemma.toLowerCase()) {
            translationUz = combined.trim();
          }
        }
      }
    } catch {}

    // Secondary: MyMemory API Fallback
    if (!translationUz) {
      try {
        const mmController = new AbortController();
        const mmTimer = setTimeout(() => mmController.abort(), 3500);
        const mmRes = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(lemma)}&langpair=en|uz`,
          { signal: mmController.signal }
        );
        clearTimeout(mmTimer);
        if (mmRes.ok) {
          const mmData = await mmRes.json();
          const translated = mmData?.responseData?.translatedText || '';
          if (translated && translated.toLowerCase() !== lemma.toLowerCase() && !translated.includes('MYMEMORY')) {
            translationUz = translated.trim();
          }
        }
      } catch {}
    }

    // Tertiary: Fallback if offline
    if (!translationUz) {
      if (detectedPos === 'adjective') translationUz = `${lemma} (sifat)`;
      else if (detectedPos === 'verb') translationUz = `${lemma} (fe'l)`;
      else if (detectedPos === 'adverb') translationUz = `${lemma} (ravish)`;
      else translationUz = `${lemma} (ot)`;
    }

    // 5. Academic collocations
    const collocations = [
      `significant ${lemma}`,
      `crucial ${lemma}`,
      `key ${lemma} factor`,
      `analyze ${lemma}`,
    ];

    // 6. Wisdom Dictionary-style Paraphrases & Academic Alternatives
    const paraphrases: ParaphraseItem[] = [];
    const paraData = lookupParaphrase(lemma);
    if (paraData?.alternatives) {
      paraData.alternatives.forEach(alt => {
        paraphrases.push({
          word: alt.word,
          cefr: alt.cefr,
          band: alt.band,
          nuanceUz: alt.nuanceUz,
          collocation: alt.collocation,
        });
      });
    } else if (synonyms.length > 0) {
      synonyms.slice(0, 5).forEach(s => {
        const lvl = classifyWordLevel(s);
        paraphrases.push({
          word: s,
          cefr: lvl.cefrLevel,
          band: lvl.ieltsBand,
        });
      });
    }

    const result: EnrichedWordData = {
      lemma,
      partOfSpeech: detectedPos,
      cefrLevel,
      ieltsBand,
      phoneticIpa,
      audioUrl: audioUrl || undefined,
      definitionEn,
      translationUz,
      uzbekContextNotes: `IELTS Academic Reading va Writing da ${cefrLevel} darajasida yuqori baholanuvchi so'z.`,
      contextSentence: exampleSentence,
      collocations,
      synonyms,
      antonyms,
      topic: 'Academic Vocabulary Core',
      paraphrases,
    };

    return NextResponse.json({ success: true, data: result, source: 'dictionary_classifier' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to auto-enrich word' },
      { status: 500 }
    );
  }
}
