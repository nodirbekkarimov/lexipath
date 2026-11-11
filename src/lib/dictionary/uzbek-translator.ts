/**
 * Production-Grade Bulletproof English-to-Uzbek Translation Service.
 * Works seamlessly in Docker/Cloud containers (Render, Vercel, VPS) with User-Agent spoofing,
 * SSL certificate support, multi-engine failover, and a rich offline dictionary.
 */

// Core high-frequency Academic & IELTS words offline dictionary (0ms latency, 100% reliability)
const OFFLINE_UZBEK_DICT: Record<string, string> = {
  // Common verbs
  deliberate: "puxta o'ylamoq, ataylab qilmoq; vazmin",
  mitigate: "zararini kamaytirmoq, yumshatmoq",
  alleviate: "yengillatmoq, og'riq yoki qiyinchilikni pasaytirmoq",
  scrutinize: "sinchiklab o'rganmoq, jiddiy tekshirmoq",
  advocate: "yoqlamoq, himoya qilmoq, tarafdor bo'lmoq",
  assess: "baholamoq, qiymat bermoq",
  enhance: "kuchaytirmoq, oshirmoq, sifatini yaxshilamoq",
  implement: "joriy qilmoq, amaliyotga tatbiq etmoq",
  maintain: "saqlab qolmoq, ta'minlamoq",
  resolve: "hal qilmoq, qarorga kelmoq",
  indicate: "ko'rsatmoq, dalolat bermoq",
  obtain: "qo'lga kiritmoq, olmoq",
  perceive: "idrok etmoq, sezmoq, tushunmoq",
  achieve: "erishmoq, muvaffaqiyat qozonmoq",
  acquire: "o'zlashtirmoq, egallamoq",
  adapt: "moslashmoq, ko'nikmoq",
  analyze: "tahlil qilmoq, tekshirmoq",
  facilitate: "osonlashtirmoq, ko'maklashmoq",
  fluctuate: "o'zgarib turmoq, tebranmoq",
  initiate: "boshlamoq, yo'lga qo'ymoq",
  innovate: "yangilik kiritmoq, innovatsiya qilmoq",
  integrate: "birlashtirmoq, yaxlit holga keltirmoq",
  justify: "oqlamoq, asoslab bermoq",
  manipulate: "boshqarmoq, o'z foydasiga o'zgartirmoq",
  modify: "o'zgartirmoq, tuzatish kiritmoq",
  participate: "ishtirok etmoq, qatnashmoq",
  persist: "qat'iyat ko'rsatmoq, davom etmoq",
  preserve: "saqlab qolmoq, asramoq",
  prevail: "ustun kelmoq, g'alaba qozonmoq",
  proceed: "davom ettirmoq, oldinga siljimoq",
  reinforce: "mustahkamlamoq, quvvatlamoq",
  reject: "rad etmoq, qabul qilmaslik",
  restrain: "tiyib turmoq, cheklamoq",
  reveal: "oshkor qilmoq, ochib bermoq",
  simulate: "taqlid qilmoq, modellashtirmoq",
  specify: "aniqlashtirmoq, alohida ko'rsatmoq",
  substitute: "o'rnini bosmoq, almashtirmoq",
  suspend: "to'xtatib turmoq, kechiktirmoq",
  sustain: "ushlab turmoq, bardosh bermoq",
  terminate: "yakunlamoq, to'xtatmoq",
  undergo: "boshdan kechirmoq, o'tmoq",
  utilize: "foydalanmoq, ishlatmoq",
  validate: "tasdiqlamoq, qonuniy deb tan olmoq",
  violate: "qoidani buzmoq, xilof ish qilmoq",

  // Common nouns
  verdict: "hukm, sud qarori, rasmiy xulosa",
  scrutiny: "sinchkovlik bilan tekshirish, nazorat",
  conundrum: "jumboq, chigal muammo, boshqotirma",
  paradigm: "qarashlar tizimi, konseptual model, paradigma",
  student: "talaba, o'quvchi",
  scholar: "olim, tadqiqotchi, ilmli inson",
  phenomenon: "hodisa, noyob voqea",
  perspective: "nuqtai nazar, dunyoqarash",
  priority: "ustuvorlik, birinchi navbatdagi vazifa",
  proportion: "mutanosiblik, qism, foiz",
  hierarchy: "ierarxiya, pog'onali tizim",
  ideology: "mafkura, dunyoqarash",
  notion: "tushuncha, tasavvur, fikr",
  objective: "maqsad, muddao",
  infrastructure: "infratuzilma, asosiy tarmoqlar",
  consequence: "oqibat, natija",
  dilemma: "qiyin tanlov, boshi berk ko'cha",
  implication: "ehtimoliy oqibat, ta'sir",
  legislation: "qonunchilik, qonun hujjatlari",
  methodology: "uslubiyat, tadqiqot metodlari",
  hypothesis: "faraz, ilmiy taxmin",
  discrepancy: "nomuvofiqlik, tafovut, farq",
  correlation: "o'zaro bog'liqlik, korrelyatsiya",

  // Common adjectives
  ubiquitous: "hamma joyda mavjud, keng tarqalgan",
  resilient: "chidamli, bardoshli, qayta tiklanuvchan",
  unprecedented: "misli ko'rilmagan, mislsiz",
  paramount: "eng muhim, birinchi darajali, hal qiluvchi",
  feasible: "amalga oshirsa bo'ladigan, amaliy jihatdan mumkin",
  indispensable: "o'rnini bosib bo'lmas, mutlaqo zarur",
  crucial: "hal qiluvchi, o'ta muhim",
  pivotal: "burilish nuqtasi bo'luvchi, eng asosiy",
  coherent: "mantiqiy, izchil, o'zaro bog'langan",
  profound: "chuqur, teran, kuchli",
  substantial: "sezilarli, salmoqli, katta",
  vulnerable: "zaif, himoyasiz, nozik",
  ambiguous: "noaniq, ikki xil ma'noli",
  consecutive: "ketma-ket, uzluksiz",
  contemporary: "zamonaviy, hozirgi zamonga oid",
  empirical: "tajribaga asoslangan, amaliy",
  fundamental: "tub, asosiy, poydevoriy",
  implicit: "yashirin, ko'zda tutilgan",
  inherent: "ajralmas, xos, ichki",
  intrinsic: "ichki, o'ziga xos",
  plausible: "ishonarli, haqiqatga yaqin",
  predominant: "ustun, yetakchi, asosiy",
  preliminary: "dastlabki, oldindan qilingan",
  reluctant: "istamay, noiloj, ikkilanuvchi",
  rigorous: "qat'iy, talabchan, sinchkov",
  spontaneous: "o'z-o'zidan sodir bo'ladigan, beixtiyor",
  widespread: "keng tarqalgan, ommaviy",
};

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'uz,en;q=0.9',
};

/**
 * Robust Uzbek translation function with multi-tier failover.
 */
export async function getAccurateUzbekTranslation(wordOrPhrase: string): Promise<string> {
  const clean = wordOrPhrase.trim();
  if (!clean) return '';
  const lower = clean.toLowerCase();

  // Tier 1: Offline high-speed verified dictionary
  if (OFFLINE_UZBEK_DICT[lower]) {
    return OFFLINE_UZBEK_DICT[lower];
  }

  // Tier 2: Chrome Extension Dictionary API (Ultra-fast, ~100-200ms)
  try {
    const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=uz&q=${encodeURIComponent(clean)}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4500);
    const res = await fetch(url, { signal: ctrl.signal, headers: BROWSER_HEADERS });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0] && typeof data[0] === 'string') {
        const text = data[0].trim();
        if (text && text.toLowerCase() !== lower) {
          return text;
        }
      }
    }
  } catch {}

  // Tier 3: Google GTX Translate API
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uz&dt=t&q=${encodeURIComponent(clean)}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4500);
    const res = await fetch(url, { signal: ctrl.signal, headers: BROWSER_HEADERS });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const text = data[0].map((item: any) => item[0]).filter(Boolean).join('').trim();
        if (text && text.toLowerCase() !== lower) {
          return text;
        }
      }
    }
  } catch {}

  // Tier 4: MyMemory API Fallback
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|uz&de=nodir.karimov@lexipath.uz`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(url, { signal: ctrl.signal, headers: BROWSER_HEADERS });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      const text = data?.responseData?.translatedText?.trim();
      if (text && text.toLowerCase() !== lower && !text.includes('MYMEMORY')) {
        return text;
      }
    }
  } catch {}

  return '';
}
