export interface MnemonicItem {
  lemma: string;
  hookUz: string;
  association: string;
  storyUz: string;
}

export const MNEMONICS_DB: Record<string, MnemonicItem> = {
  resilient: {
    lemma: 'resilient',
    hookUz: 'Rezinadek chidamli',
    association: 'Rezina (rubber) zarbaga bardosh berib yana avvalgi shakliga qaytadi.',
    storyUz: 'Katta inqiroz yoki bosim tushganda rezinadek bukilsa ham sinmaydigan, qiyinchilikdan so\'ng darhol o\'zini o\'nglab oladigan inson yoki iqtisodiyot.',
  },
  ubiquitous: {
    lemma: 'ubiquitous',
    hookUz: 'U biqiq joyda ham bor!',
    association: 'Biqiq, berk, qorong\'i burchakda ham uchraydigan narsa.',
    storyUz: 'Ko\'zingizni qayerga qaratmang — o\'sha narsa hoziru-nozir. Masalan, smartfonlar hozir eng chekka qishloqdagi eng biqiq joyda ham bor.',
  },
  meticulous: {
    lemma: 'meticulous',
    hookUz: 'Metr bilan o\'lchovchi',
    association: 'Har bir santimetr va millimetrni sinchkovlik bilan tekshiruvchi me\'mor.',
    storyUz: 'Ishni oddiy emas, har bir mayda detalini mikroskop yoki metr bilan tekshirib, xatosiz bajaruvchi o\'ta diqqatli odam.',
  },
  ameliorate: {
    lemma: 'ameliorate',
    hookUz: 'Yer melioratsiyasi',
    association: 'Qishloq xo\'jaligida yer holatini yaxshilash melioratsiya deb ataladi.',
    storyUz: 'Sho\'r bosgan yoki xarob bo\'lgan tuproqni qayta hosildor qilishdek, yomonlashgan og\'ir vaziyatni ijobiy tomonga tuzatmoq va yaxshilamoq.',
  },
  curtail: {
    lemma: 'curtail',
    hookUz: 'Dumini (tail) kesmoq',
    association: 'Tail (dum) so\'zi bor — keraksiz o\'sib ketgan qismini qisqartirish.',
    storyUz: 'Davlat yoki kompaniya ortiqcha cho\'zilib ketgan xarajatlarining dumini kesib, ularni qat\'iy qisqartiradi.',
  },
  dwindle: {
    lemma: 'dwindle',
    hookUz: 'Daryo suvi shamolda qurishi (wind + dwindle)',
    association: 'Suv yoki boylik asta-sekin pasayib tugashi.',
    storyUz: 'Orol dengizi suvidek yil sayin pasayib, oxir-oqibat yo\'q bo\'lib ketish darajasida kamayib bormoq.',
  },
  bolster: {
    lemma: 'bolster',
    hookUz: 'Po\'latdek baquvvat suyanchiq',
    association: 'Bo\'ladigan (kuchli) ustun.',
    storyUz: 'Yiqilayotgan devor yoki iqtisodiyotning tagiga mustahkam tayanch qo\'yib, uni kuchaytirmoq va mustahkamlamoq.',
  },
  perilous: {
    lemma: 'perilous',
    hookUz: 'Peril (jarlik yoqasi) — xatar',
    association: 'Qora tunda tor tog\' yo\'lidan yurish.',
    storyUz: 'Har bir qadamingiz hayot-mamot masalasi bo\'lgan, o\'ta jiddiy xavf-xatarga to\'la vaziyat.',
  },
};

export function getMnemonicForWord(lemma: string): MnemonicItem | null {
  const clean = lemma.toLowerCase().trim();
  return MNEMONICS_DB[clean] || null;
}
