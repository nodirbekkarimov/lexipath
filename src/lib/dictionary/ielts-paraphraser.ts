export interface ParaphraseEntry {
  originalWord: string;
  category: 'adjective' | 'verb' | 'noun' | 'adverb';
  uzbekMeaning: string;
  alternatives: {
    word: string;
    cefr: 'B2' | 'C1' | 'C2';
    band: number;
    nuanceUz: string;
    essayExample: string;
    collocation: string;
  }[];
  ieltsWritingTemplate: string;
}

export const IELTS_PARAPHRASE_DB: Record<string, ParaphraseEntry> = {
  important: {
    originalWord: 'important',
    category: 'adjective',
    uzbekMeaning: 'muhim, ahamiyatli',
    alternatives: [
      {
        word: 'paramount',
        cefr: 'C2',
        band: 8.5,
        nuanceUz: 'Hamma narsadan ustun turadigan, eng birlamchi ahamiyatga ega',
        essayExample: 'Ensuring environmental sustainability is of paramount importance for succeeding generations.',
        collocation: 'of paramount importance',
      },
      {
        word: 'pivotal',
        cefr: 'C1',
        band: 8.0,
        nuanceUz: 'Harakat yoki jarayonning burilish nuqtasi bo\'luvchi hal qiluvchi',
        essayExample: 'Education plays a pivotal role in eradicating systemic poverty across developing nations.',
        collocation: 'play a pivotal role',
      },
      {
        word: 'crucial',
        cefr: 'B2',
        band: 7.0,
        nuanceUz: 'Muvaffaqiyat uchun mutlaqo zarur va hal qiluvchi',
        essayExample: 'Early childhood intervention is crucial for cognitive and social development.',
        collocation: 'crucial factor / element',
      },
      {
        word: 'indispensable',
        cefr: 'C1',
        band: 8.0,
        nuanceUz: 'Usiz ish bitmaydigan, o\'rnini bosib bo\'lmas',
        essayExample: 'Critical thinking has become an indispensable asset in modern scientific research.',
        collocation: 'an indispensable tool / asset',
      },
    ],
    ieltsWritingTemplate: 'It is widely contended that [Topic] is of paramount importance; indeed, it plays a pivotal role in shaping modern societies.',
  },
  increase: {
    originalWord: 'increase',
    category: 'verb',
    uzbekMeaning: 'oshmoq, ko\'paymoq',
    alternatives: [
      {
        word: 'escalate',
        cefr: 'C1',
        band: 8.0,
        nuanceUz: 'Jadal va ko\'pincha jiddiy darajada keskin ko\'tarilmoq',
        essayExample: 'Tensions between industrialized nations may escalate if carbon emissions remain unchecked.',
        collocation: 'escalate dramatically',
      },
      {
        word: 'proliferate',
        cefr: 'C2',
        band: 8.5,
        nuanceUz: 'Soni va ko\'lami geometrik progressiyada ko\'paymoq',
        essayExample: 'Online education platforms have proliferated exponentially over the past decade.',
        collocation: 'proliferate rapidly',
      },
      {
        word: 'surge',
        cefr: 'C1',
        band: 7.5,
        nuanceUz: 'To\'lqin kabi to\'satdan va kuchli ko\'tarilmoq (Task 1 grafiklarga juda mos)',
        essayExample: 'Demand for renewable energy surged notably between 2015 and 2024.',
        collocation: 'experience a surge in demand',
      },
      {
        word: 'proliferate',
        cefr: 'C1',
        band: 7.5,
        nuanceUz: 'Hosil bo\'lmoq yoki yig\'ilib bormoq',
        essayExample: 'Mounting evidence suggests that prolonged screen exposure impairs children\'s sleep cycles.',
        collocation: 'mounting pressure / evidence',
      },
    ],
    ieltsWritingTemplate: 'As illustrated in the data, the figure underwent a dramatic surge, reflecting proliferating consumer interest.',
  },
  decrease: {
    originalWord: 'decrease',
    category: 'verb',
    uzbekMeaning: 'kamaymoq, pasaymoq',
    alternatives: [
      {
        word: 'plummet',
        cefr: 'C1',
        band: 8.0,
        nuanceUz: 'Juda balanddan to\'satdan tik qulamoq, keskin tushib ketmoq',
        essayExample: 'Share prices plummeted drastically in the wake of the international trade sanctions.',
        collocation: 'plummet drastically / sharply',
      },
      {
        word: 'dwindle',
        cefr: 'C2',
        band: 8.5,
        nuanceUz: 'Asta-sekin tugab, yo\'qolib yoki kamayib bormoq (resurslar haqida)',
        essayExample: 'Freshwater reserves are dwindling rapidly due to climate change and agricultural over-extraction.',
        collocation: 'dwindling resources / numbers',
      },
      {
        word: 'curtail',
        cefr: 'C1',
        band: 8.0,
        nuanceUz: 'Cheklamoq, qisqartirmoq (xarajatlar yoki erkinlik haqida)',
        essayExample: 'Governments ought to curtail unnecessary public expenditure during fiscal downturns.',
        collocation: 'curtail spending / emissions',
      },
    ],
    ieltsWritingTemplate: 'Following a peak in 2018, the rates plummeted precipitously, leaving resources severely dwindled.',
  },
  problem: {
    originalWord: 'problem',
    category: 'noun',
    uzbekMeaning: 'muammo, qiyinchilik',
    alternatives: [
      {
        word: 'predicament',
        cefr: 'C2',
        band: 8.5,
        nuanceUz: 'Chiqish yo\'li og\'ir va noqulay bo\'lgan murakkab vaziyat',
        essayExample: 'Developing nations face a severe predicament when balancing industrial growth with environmental pledges.',
        collocation: 'face a dilemma / predicament',
      },
      {
        word: 'dilemma',
        cefr: 'B2',
        band: 7.5,
        nuanceUz: 'Ikkita qiyin tanlov o\'rtasida qolgan vaziyat',
        essayExample: 'Policymakers are confronted with an ethical dilemma regarding the regulation of generative AI.',
        collocation: 'ethical / moral dilemma',
      },
      {
        word: 'setback',
        cefr: 'B2',
        band: 7.0,
        nuanceUz: 'Rivojlanishni to\'xtatib qo\'yuvchi vaqtinchalik to\'siq yoki orqaga ketish',
        essayExample: 'The economic recession dealt a catastrophic setback to infrastructure modernization.',
        collocation: 'suffer a major setback',
      },
    ],
    ieltsWritingTemplate: 'This burgeoning predicament poses a multifaceted threat that cannot be resolved through superficial measures.',
  },
  help: {
    originalWord: 'help',
    category: 'verb',
    uzbekMeaning: 'yordam bermoq, osonlashtirmoq',
    alternatives: [
      {
        word: 'facilitate',
        cefr: 'C1',
        band: 8.0,
        nuanceUz: 'Jarayonni yengillashtirmoq, qulay sharoit yaratmoq',
        essayExample: 'High-speed internet access facilitates seamless communication and remote scholarly collaboration.',
        collocation: 'facilitate growth / learning',
      },
      {
        word: 'ameliorate',
        cefr: 'C2',
        band: 8.5,
        nuanceUz: 'Yomon yoki og\'ir holatni yaxshilamoq, yengillatmoq',
        essayExample: 'Targeted welfare subsidies can substantially ameliorate living standards among low-income households.',
        collocation: 'ameliorate the situation / hardship',
      },
      {
        word: 'bolster',
        cefr: 'C1',
        band: 7.5,
        nuanceUz: 'Kuchaytirmoq, tayanch bo\'lib mustahkamlamoq',
        essayExample: 'Investing in public healthcare will inevitably bolster economic resilience across the country.',
        collocation: 'bolster the economy / confidence',
      },
    ],
    ieltsWritingTemplate: 'Such pragmatic policies not only facilitate economic integration but also bolster societal cohesion.',
  },
  show: {
    originalWord: 'show',
    category: 'verb',
    uzbekMeaning: 'ko\'rsatmoq, ifodalamoq',
    alternatives: [
      {
        word: 'demonstrate',
        cefr: 'B2',
        band: 7.0,
        nuanceUz: 'Isbot bilan ko\'rsatib bermoq',
        essayExample: 'Empirical studies clearly demonstrate the positive correlation between literacy and longevity.',
        collocation: 'demonstrate a clear link',
      },
      {
        word: 'exemplify',
        cefr: 'C1',
        band: 8.0,
        nuanceUz: 'Eng yorqin misoli bo\'lmoq',
        essayExample: 'The Scandinavian healthcare system exemplifies how public funding achieves egalitarian outcomes.',
        collocation: 'exemplify best practice',
      },
      {
        word: 'elucidate',
        cefr: 'C2',
        band: 8.5,
        nuanceUz: 'Chuqur tushuntirib, oydinlik kiritmoq',
        essayExample: 'The subsequent section elucidates the underlying economic mechanisms governing inflation.',
        collocation: 'elucidate the complex mechanisms',
      },
    ],
    ieltsWritingTemplate: 'The empirical findings convincingly elucidate this phenomenon, demonstrating an unambiguous upward trend.',
  },
  cause: {
    originalWord: 'cause',
    category: 'verb',
    uzbekMeaning: 'sabab bo\'lmoq, keltirib chiqarmoq',
    alternatives: [
      {
        word: 'precipitate',
        cefr: 'C2',
        band: 8.5,
        nuanceUz: 'To\'satdan va muddatidan oldin yuz berishiga turtki bermoq',
        essayExample: 'The sudden bankruptcy of the regional bank precipitated a widespread liquidity crisis.',
        collocation: 'precipitate a crisis',
      },
      {
        word: 'catalyze',
        cefr: 'C1',
        band: 8.0,
        nuanceUz: 'Katalizator bo\'lmoq, jarayonni tezlashtirib yubormoq',
        essayExample: 'The transition to remote work catalyzed rapid digital transformation across corporate sectors.',
        collocation: 'catalyze economic growth',
      },
      {
        word: 'engender',
        cefr: 'C2',
        band: 8.5,
        nuanceUz: 'Tuyg\'u, holat yoki munosabatni paydo qilmoq',
        essayExample: 'Persistent social inequality inevitably engenders resentment among marginalized demographics.',
        collocation: 'engender feelings / hostility',
      },
    ],
    ieltsWritingTemplate: 'Failing to implement these reforms may precipitate dire economic fallout, engendering deep societal discord.',
  },
  dangerous: {
    originalWord: 'dangerous',
    category: 'adjective',
    uzbekMeaning: 'xavfli, zararli',
    alternatives: [
      {
        word: 'perilous',
        cefr: 'C2',
        band: 8.5,
        nuanceUz: "O'ta jiddiy xavf-xatar bilan to'la",
        essayExample: 'Relying exclusively on non-renewable fossil fuels is a perilous economic trajectory.',
        collocation: 'a perilous journey / path',
      },
      {
        word: 'detrimental',
        cefr: 'C1',
        band: 8.0,
        nuanceUz: 'Zarar yetkazuvchi, salbiy oqibatlarga olib keluvchi',
        essayExample: 'Chronic sleep deprivation exerts a detrimental impact on cognitive retention and mental well-being.',
        collocation: 'have a detrimental effect on',
      },
      {
        word: 'deleterious',
        cefr: 'C2',
        band: 9.0,
        nuanceUz: 'Sekin-asta yemiruvchi, halokatli zararli (akademik daraja)',
        essayExample: 'Microplastic pollution exerts deleterious effects on marine biodiversity.',
        collocation: 'deleterious consequences',
      },
    ],
    ieltsWritingTemplate: 'This uncontrolled expansion poses a perilous dilemma with undeniably deleterious ramifications for the biosphere.',
  },
};

export function lookupParaphrase(word: string): ParaphraseEntry | null {
  const clean = word.toLowerCase().trim();
  if (IELTS_PARAPHRASE_DB[clean]) {
    return IELTS_PARAPHRASE_DB[clean];
  }

  // Look for partial matching or synonyms
  for (const [key, entry] of Object.entries(IELTS_PARAPHRASE_DB)) {
    if (key.includes(clean) || clean.includes(key)) {
      return entry;
    }
  }

  return null;
}
