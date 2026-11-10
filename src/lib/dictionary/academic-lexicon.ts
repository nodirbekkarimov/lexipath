import { CEFRLevel, PartOfSpeech } from '@/types/database';

export interface ParaphraseItem {
  word: string;
  cefr: CEFRLevel;
  band: number;
  nuanceUz?: string;
  collocation?: string;
}

export interface EnrichedWordData {
  lemma: string;
  partOfSpeech: PartOfSpeech;
  cefrLevel: CEFRLevel;
  ieltsBand: number;
  phoneticIpa: string;
  audioUrl?: string;
  definitionEn: string;
  translationUz: string;
  uzbekContextNotes?: string;
  contextSentence: string;
  collocations: string[];
  synonyms: string[];
  antonyms: string[];
  topic: string;
  paraphrases?: ParaphraseItem[];
}

// Built-in high-frequency IELTS Academic Lexicon database with accurate Uzbek translations
export const ACADEMIC_WORDS_DB: Record<string, Partial<EnrichedWordData>> = {
  resilient: {
    partOfSpeech: 'adjective',
    cefrLevel: 'C1',
    ieltsBand: 7.5,
    phoneticIpa: '/rɪˈzɪl.i.ənt/',
    definitionEn: 'Able to withstand or recover quickly from difficult conditions, adversity, or damage.',
    translationUz: 'Chidamli, bardoshli, qiyinchilikdan tez tiklana oladigan',
    uzbekContextNotes: 'Iqtisodiyot, inson ruhiyati yoki ekotizimlarning inqirozlardan so\'ng tiklanish qobiliyati haqida gapirganda ishlatiladi.',
    contextSentence: 'Developing resilient infrastructure is critical for coastal communities prone to typhoons.',
    collocations: ['resilient economy', 'resilient personality', 'highly resilient', 'resilient infrastructure'],
    synonyms: ['adaptable', 'durable', 'tenacious', 'hardy'],
    antonyms: ['fragile', 'vulnerable', 'weak'],
    topic: 'Environment & Psychology',
  },
  ubiquitous: {
    partOfSpeech: 'adjective',
    cefrLevel: 'C2',
    ieltsBand: 8.5,
    phoneticIpa: '/juːˈbɪk.wɪ.təs/',
    definitionEn: 'Present, appearing, or found everywhere at the same time.',
    translationUz: 'Hamma joyda uchraydigan, keng tarqalgan, yalpi mavjud',
    uzbekContextNotes: 'Zamonaviy texnologiyalar, smartfonlar yoki sun\'iy intellektning har qadamda uchrashini ifodalash uchun ayni muddao.',
    contextSentence: 'Smartphones have become so ubiquitous that life without them is virtually unimaginable for modern youth.',
    collocations: ['ubiquitous presence', 'ubiquitous technology', 'become ubiquitous', 'almost ubiquitous'],
    synonyms: ['omnipresent', 'pervasive', 'everywhere', 'universal'],
    antonyms: ['rare', 'scarce', 'infrequent'],
    topic: 'Technology & Modern Life',
  },
  mitigate: {
    partOfSpeech: 'verb',
    cefrLevel: 'C1',
    ieltsBand: 7.5,
    phoneticIpa: '/ˈmɪt.ɪ.ɡeɪt/',
    definitionEn: 'To make something bad or harmful less severe, serious, or painful.',
    translationUz: 'Yumshatmoq, zararini kamaytirmoq, xavfni pasaytirmoq',
    uzbekContextNotes: 'IELTS Writing Task 2 da iqlim o\'zgarishi, qashshoqlik yoki iqtisodiy inqiroz zararlarini kamaytirish haqida yozishda eng ko\'p ball beruvchi so\'zlardan biri.',
    contextSentence: 'Government incentives for solar panels can significantly mitigate the environmental impact of fossil fuels.',
    collocations: ['mitigate risks', 'mitigate the impact', 'mitigate effects', 'mitigate climate change'],
    synonyms: ['alleviate', 'reduce', 'diminish', 'lessen'],
    antonyms: ['aggravate', 'exacerbate', 'intensify'],
    topic: 'Environment & Policy',
  },
  alleviate: {
    partOfSpeech: 'verb',
    cefrLevel: 'C1',
    ieltsBand: 7.5,
    phoneticIpa: '/əˈliː.vi.eɪt/',
    definitionEn: 'To make physical or emotional suffering, distress, or problems less intense.',
    translationUz: 'Yengillatmoq, ozaytirmoq, kamaytirmoq (og\'riq, yuk yoki muammoni)',
    uzbekContextNotes: 'Tirbandlik, ochlik yoki og\'riq kabi salbiy holatlarni yengillashtirishda qo\'llanadi.',
    contextSentence: 'Subsidized metro rail networks directly alleviate traffic congestion in metropolitan centers.',
    collocations: ['alleviate poverty', 'alleviate congestion', 'alleviate suffering', 'alleviate symptoms'],
    synonyms: ['ease', 'relieve', 'assuage', 'soothe'],
    antonyms: ['worsen', 'aggravate', 'intensify'],
    topic: 'Urban Geography & Economics',
  },
  scrutinize: {
    partOfSpeech: 'verb',
    cefrLevel: 'C1',
    ieltsBand: 7.5,
    phoneticIpa: '/ˈskruː.tɪ.naɪz/',
    definitionEn: 'To examine or inspect someone or something very thoroughly and critically.',
    translationUz: 'Sinchkovlik bilan tekshirmoq, sinchiklab o\'rganmoq',
    uzbekContextNotes: 'Hujjatlar, hisobotlar, dalillar yoki qonun loyihalarini har bir tafsilotigacha sinchiklab tekshirishda ishlatiladi.',
    contextSentence: 'Regulatory authorities scrutinized the financial accounts to ensure full compliance with international standards.',
    collocations: ['scrutinize carefully', 'closely scrutinize', 'scrutinize evidence', 'scrutinize proposals'],
    synonyms: ['examine', 'inspect', 'investigate', 'audit'],
    antonyms: ['ignore', 'overlook', 'neglect'],
    topic: 'Law & Governance',
  },
  paradigm: {
    partOfSpeech: 'noun',
    cefrLevel: 'C2',
    ieltsBand: 8.5,
    phoneticIpa: '/ˈpær.ə.daɪm/',
    definitionEn: 'A typical example, model, or conceptual framework underlying the theories and practices of a scientific or philosophical discipline.',
    translationUz: 'Paradigma, konseptual model, tafakkur tizimi',
    uzbekContextNotes: 'Fan yoki jamiyatda butun bir tizim yoki qarashlar o\'zgarganda ("paradigm shift" - paradigmaning o\'zgarishi) ishlatiladi.',
    contextSentence: 'The transition from Newtonian physics to quantum mechanics represented a fundamental paradigm shift.',
    collocations: ['paradigm shift', 'dominant paradigm', 'new paradigm', 'philosophical paradigm'],
    synonyms: ['framework', 'model', 'pattern', 'archetype'],
    antonyms: [],
    topic: 'Academic Theory & Science',
  },
  ameliorate: {
    partOfSpeech: 'verb',
    cefrLevel: 'C2',
    ieltsBand: 8.5,
    phoneticIpa: '/əˈmiː.li.ə.reɪt/',
    definitionEn: 'To make something unsatisfactory, defective, or difficult noticeably better.',
    translationUz: 'Yaxshilamoq, ijobiy tomonga o\'zgartirmoq, holatni tuzatmoq',
    uzbekContextNotes: 'Yashash sharoitlari, mehnat sharoitlari yoki iqtisodiy vaziyatni sezilarli yaxshilashda rasmiy akademik tilda qo\'llanadi.',
    contextSentence: 'The foreign aid initiative helped ameliorate living conditions in drought-afflicted rural districts.',
    collocations: ['ameliorate conditions', 'ameliorate the situation', 'ameliorate poverty', 'significantly ameliorate'],
    synonyms: ['improve', 'better', 'enhance', 'upgrade'],
    antonyms: ['deteriorate', 'worsen'],
    topic: 'Social Welfare & Economics',
  },
  comprehensive: {
    partOfSpeech: 'adjective',
    cefrLevel: 'B2',
    ieltsBand: 6.5,
    phoneticIpa: '/ˌkɒm.prɪˈhen.sɪv/',
    definitionEn: 'Including or dealing with all or nearly all elements or aspects of something.',
    translationUz: 'Keng qamrovli, har tomonlama to\'liq, mukammal',
    uzbekContextNotes: 'Tadqiqot, reja, ta\'lim tizimi yoki hisobotning hamma jabhalarni o\'z ichiga olganligini ko\'rsatishda ishlatiladi.',
    contextSentence: 'The university proposed a comprehensive reform of its undergraduate curriculum.',
    collocations: ['comprehensive review', 'comprehensive study', 'comprehensive approach', 'comprehensive plan'],
    synonyms: ['exhaustive', 'inclusive', 'thorough', 'all-encompassing'],
    antonyms: ['limited', 'partial', 'selective'],
    topic: 'Education & Research',
  },
  delineate: {
    partOfSpeech: 'verb',
    cefrLevel: 'C2',
    ieltsBand: 8.5,
    phoneticIpa: '/dɪˈlɪn.i.eɪt/',
    definitionEn: 'To describe, portray, or define boundaries with precision and clarity.',
    translationUz: 'Aniq tasvirlab bermoq, chegaralarini belgilamoq, chizib bermoq',
    uzbekContextNotes: 'Qonunlar, vazifalar taqsimoti yoki loyiha doirasini aniq qilib ko\'rsatib berishda qo\'llanadi.',
    contextSentence: 'The charter clearly delineates the respective responsibilities of municipal and national bodies.',
    collocations: ['delineate responsibilities', 'clearly delineate', 'delineate boundaries', 'delineate steps'],
    synonyms: ['outline', 'specify', 'detail', 'demarcate'],
    antonyms: ['confuse', 'distort', 'obscure'],
    topic: 'Governance & Law',
  },
  ephemeral: {
    partOfSpeech: 'adjective',
    cefrLevel: 'C2',
    ieltsBand: 8.5,
    phoneticIpa: '/ɪˈfem.ər.əl/',
    definitionEn: 'Lasting for a very short time; fleeting and transitory.',
    translationUz: 'O\'tkinchi, qisqa muddatli, lahzalik',
    uzbekContextNotes: 'Shuhrat, moda, his-tuyg\'ular yoki tabiat hodisalarining qisqa umr ko\'rishini poetik va falsafiy ifodalashda qo\'llanadi.',
    contextSentence: 'Social media fame is often ephemeral, evaporating as quickly as the next viral trend emerges.',
    collocations: ['ephemeral nature', 'ephemeral pleasures', 'ephemeral fame', 'essentially ephemeral'],
    synonyms: ['fleeting', 'transitory', 'momentary', 'evanescent'],
    antonyms: ['permanent', 'enduring', 'eternal'],
    topic: 'Philosophy & Culture',
  },
  pragmatic: {
    partOfSpeech: 'adjective',
    cefrLevel: 'C1',
    ieltsBand: 7.5,
    phoneticIpa: '/præɡˈmæt.ɪk/',
    definitionEn: 'Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.',
    translationUz: 'Amaliy, realistik, pragmatik (nazariyadan ko\'ra amaliyotga tayanadigan)',
    uzbekContextNotes: 'Siyosat, biznes yoki shaxsiy qarorlarda quruq nazariyaga emas, amaliy foydaga qarab ish tutishni ifodalaydi.',
    contextSentence: 'The city council adopted a pragmatic approach to affordable housing rather than pursuing idealistic schemes.',
    collocations: ['pragmatic approach', 'pragmatic solution', 'pragmatic policy', 'highly pragmatic'],
    synonyms: ['practical', 'realistic', 'sensible', 'utilitarian'],
    antonyms: ['idealistic', 'impractical', 'dogmatic'],
    topic: 'Decision Making & Politics',
  },
  catalyze: {
    partOfSpeech: 'verb',
    cefrLevel: 'C1',
    ieltsBand: 7.5,
    phoneticIpa: '/ˈkæt.əl.aɪz/',
    definitionEn: 'To accelerate or trigger a significant process, transition, or development.',
    translationUz: 'Turtki bermoq, tezlashtirmoq, jadallashtirmoq',
    uzbekContextNotes: 'Islohotlar yoki yangi kashfiyotlar butun bir soha rivojiga tezkor turtki bo\'lganida ishlatiladi.',
    contextSentence: 'Targeted government grants catalyzed substantial private investment in renewable energy.',
    collocations: ['catalyze growth', 'catalyze innovation', 'catalyze change', 'catalyze development'],
    synonyms: ['accelerate', 'spur', 'stimulate', 'provoke'],
    antonyms: ['impede', 'hinder', 'inhibit'],
    topic: 'Economics & Innovation',
  },
  scrutiny: {
    partOfSpeech: 'noun',
    cefrLevel: 'C1',
    ieltsBand: 7.5,
    phoneticIpa: '/ˈskruː.tɪ.ni/',
    definitionEn: 'Critical, thorough, and disciplined examination or inspection.',
    translationUz: 'Sinchkovlik bilan tekshirish, chuqur taftish',
    uzbekContextNotes: '"Under close scrutiny" (qattiq nazorat/tekshiruv ostida) iborasi IELTS da keng qo\'llanadi.',
    contextSentence: 'Public expenditure decisions must be subject to rigorous parliamentary scrutiny.',
    collocations: ['close scrutiny', 'public scrutiny', 'under scrutiny', 'rigorous scrutiny'],
    synonyms: ['inspection', 'examination', 'audit', 'investigation'],
    antonyms: ['neglect', 'oversight'],
    topic: 'Governance & Media',
  },
  unprecedented: {
    partOfSpeech: 'adjective',
    cefrLevel: 'C1',
    ieltsBand: 7.5,
    phoneticIpa: '/ʌnˈpres.ɪ.den.tɪd/',
    definitionEn: 'Never done, known, or experienced before.',
    translationUz: 'Misli ko\'rilmagan, mislsiz, tarixdan avval bo\'lmagan',
    uzbekContextNotes: 'Hali hech qachon ro\'y bermagan o\'sish, inqiroz yoki texnologik sakrashlarni tasvirlashda qo\'llanadi.',
    contextSentence: 'The rapid rise of artificial intelligence poses unprecedented ethical challenges.',
    collocations: ['unprecedented growth', 'unprecedented challenges', 'at an unprecedented rate', 'unprecedented scale'],
    synonyms: ['unparalleled', 'novel', 'groundbreaking', 'extraordinary'],
    antonyms: ['precedented', 'familiar', 'ordinary'],
    topic: 'Global Trends & Science',
  },
  feasible: {
    partOfSpeech: 'adjective',
    cefrLevel: 'B2',
    ieltsBand: 6.5,
    phoneticIpa: '/ˈfiː.zə.bəl/',
    definitionEn: 'Possible and practical to achieve, do, or execute easily or conveniently.',
    translationUz: 'Amalga oshirsa bo\'ladigan, maqbul, amaliy jihatdan mumkin',
    uzbekContextNotes: 'Loyiha yoki taklifning hayotga tatbiq qilinishi mumkinligini aytishda ishlatiladi.',
    contextSentence: 'Economic analysts concluded that a transition to 100% solar power is technically feasible within a decade.',
    collocations: ['economically feasible', 'technically feasible', 'feasible solution', 'feasible option'],
    synonyms: ['viable', 'achievable', 'practicable', 'workable'],
    antonyms: ['infeasible', 'impossible', 'impracticable'],
    topic: 'Engineering & Economics',
  },
  paramount: {
    partOfSpeech: 'adjective',
    cefrLevel: 'C2',
    ieltsBand: 8.5,
    phoneticIpa: '/ˈpær.ə.maʊnt/',
    definitionEn: 'More important than anything else; supreme in significance.',
    translationUz: 'Eng muhim, birinchi darajali, hal qiluvchi ahamiyatga ega',
    uzbekContextNotes: '"Of paramount importance" iborasi har qanday IELTS essesining xulosasi uchun idealdir.',
    contextSentence: 'Maintaining strict data confidentiality is of paramount importance to our cybersecurity protocol.',
    collocations: ['paramount importance', 'paramount concern', 'paramount objective', 'paramount duty'],
    synonyms: ['primary', 'supreme', 'vital', 'predominant'],
    antonyms: ['minor', 'trivial', 'negligible'],
    topic: 'Ethics & Priority',
  },
  verdict: {
    partOfSpeech: 'noun',
    cefrLevel: 'B2',
    ieltsBand: 6.5,
    phoneticIpa: '/ˈvɜː.dɪkt/',
    definitionEn: 'An official decision made after examining the facts, especially by a jury or judge in a court of law.',
    translationUz: 'Hukm, sud qarori, rasmiy xulosa',
    uzbekContextNotes: 'Sud jarayoni, qonuniy qarorlar yoki qat\'iy xulosalar haqida gapirganda ishlatiladi.',
    contextSentence: 'The jury deliberated for four hours before delivering a unanimous guilty verdict.',
    collocations: ['reach a verdict', 'final verdict', 'unanimous verdict', 'await the verdict'],
    synonyms: ['judgment', 'ruling', 'finding', 'decision', 'adjudication'],
    antonyms: [],
    topic: 'Law & Justice',
  },
};

// Common A1-B1 everyday words and grammatical particles
const BASIC_EVERYDAY_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'it', 'its', 'we', 'us', 'our', 'they', 'them', 'their',
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'a', 'an', 'the', 'this', 'that', 'these', 'those', 'there', 'here',
  'student', 'teacher', 'doctor', 'school', 'university', 'book', 'pen', 'pencil', 'computer', 'phone',
  'water', 'food', 'bread', 'apple', 'car', 'bus', 'train', 'city', 'country', 'house', 'room', 'home',
  'day', 'night', 'morning', 'evening', 'year', 'month', 'week', 'time', 'hour', 'minute',
  'man', 'woman', 'child', 'children', 'boy', 'girl', 'friend', 'family', 'mother', 'father',
  'go', 'come', 'see', 'look', 'watch', 'listen', 'speak', 'talk', 'read', 'write', 'learn', 'study',
  'eat', 'drink', 'sleep', 'wake', 'live', 'work', 'play', 'buy', 'sell', 'help', 'like', 'love',
  'good', 'bad', 'big', 'small', 'old', 'new', 'young', 'hot', 'cold', 'happy', 'sad', 'easy', 'hard',
  'yes', 'no', 'not', 'very', 'too', 'also', 'and', 'but', 'or', 'so', 'because', 'with', 'without',
  'in', 'on', 'at', 'to', 'for', 'from', 'of', 'by', 'about', 'under', 'over', 'between',
  'what', 'where', 'when', 'why', 'who', 'how', 'which', 'congratulations', 'entertainment',
  'advertisement', 'understanding', 'information', 'international', 'relationship'
]);

/**
 * Intelligent CEFR Level and IELTS Band heuristic classifier
 * Evaluates morphological suffixes, vocabulary frequency, and phrases accurately.
 */
export function classifyWordLevel(lemma: string, pos?: string): { cefrLevel: CEFRLevel; ieltsBand: number } {
  const clean = lemma.toLowerCase().trim();
  const tokens = clean.split(/\s+/).filter(Boolean);

  // 1. Direct hit in academic DB
  if (ACADEMIC_WORDS_DB[clean]?.cefrLevel) {
    return {
      cefrLevel: ACADEMIC_WORDS_DB[clean]!.cefrLevel!,
      ieltsBand: ACADEMIC_WORDS_DB[clean]!.ieltsBand || 7.5,
    };
  }

  // 2. Handle Multi-word phrases / sentences (e.g., "I am a student", "good morning")
  if (tokens.length > 1) {
    const basicMatches = tokens.filter(t => BASIC_EVERYDAY_WORDS.has(t)).length;
    // If the majority of words are everyday A1/A2/B1 words
    if (basicMatches / tokens.length >= 0.5) {
      return { cefrLevel: 'B1', ieltsBand: 5.0 };
    }
    // Check if any word inside the phrase is advanced
    for (const t of tokens) {
      if (ACADEMIC_WORDS_DB[t]?.cefrLevel) {
        return {
          cefrLevel: ACADEMIC_WORDS_DB[t]!.cefrLevel!,
          ieltsBand: ACADEMIC_WORDS_DB[t]!.ieltsBand || 7.5,
        };
      }
    }
    return { cefrLevel: 'B2', ieltsBand: 6.0 };
  }

  // 3. Single basic everyday words
  if (BASIC_EVERYDAY_WORDS.has(clean)) {
    return { cefrLevel: 'B1', ieltsBand: 5.0 };
  }

  // 4. Academic suffixes & root patterns
  const c2Patterns = [/qu?int/, /philic$/, /esque$/, /cratic$/, /morph/, /logy$/, /phem/, /pervas/, /equivoc/];
  const c1Suffixes = ['ize', 'ise', 'ate', 'ous', 'ious', 'ent', 'ant', 'ence', 'ance', 'ity', 'ive', 'ably', 'ibly'];
  const b2Suffixes = ['tion', 'sion', 'ment', 'able', 'ible', 'less', 'ful', 'ical', 'ness'];

  if (c2Patterns.some(p => p.test(clean))) {
    return { cefrLevel: 'C2', ieltsBand: 8.5 };
  }

  for (const suf of c1Suffixes) {
    if (clean.endsWith(suf) && clean.length >= 7) {
      return { cefrLevel: 'C1', ieltsBand: 7.5 };
    }
  }

  for (const suf of b2Suffixes) {
    if (clean.endsWith(suf) && clean.length >= 6) {
      return { cefrLevel: 'B2', ieltsBand: 6.5 };
    }
  }

  if (clean.length >= 9) {
    return { cefrLevel: 'B2', ieltsBand: 6.5 };
  }

  return { cefrLevel: 'B1', ieltsBand: 5.5 };
}

/**
 * Automatic Part of Speech detector based on English morphology
 */
export function detectPartOfSpeech(word: string): PartOfSpeech {
  const w = word.toLowerCase().trim();

  if (w.includes(' ')) return 'phrase';
  if (w.endsWith('ly')) return 'adverb';
  if (w.endsWith('ate') || w.endsWith('ize') || w.endsWith('ise') || w.endsWith('ify')) return 'verb';
  if (w.endsWith('ous') || w.endsWith('ive') || w.endsWith('able') || w.endsWith('ible') || w.endsWith('ful') || w.endsWith('al') || w.endsWith('ic')) return 'adjective';
  if (w.endsWith('tion') || w.endsWith('sion') || w.endsWith('ment') || w.endsWith('ness') || w.endsWith('ity') || w.endsWith('ism') || w.endsWith('ence') || w.endsWith('ance')) return 'noun';

  return 'noun';
}
