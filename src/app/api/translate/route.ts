import { NextRequest, NextResponse } from 'next/server';
import { getAccurateUzbekTranslation } from '@/lib/dictionary/uzbek-translator';
import { ACADEMIC_WORDS_DB } from '@/lib/dictionary/academic-lexicon';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = (body.text || body.word || body.q || '').trim();

    if (!text) {
      return NextResponse.json({ error: 'Matn yoki so\'z kiritilishi shart' }, { status: 400 });
    }

    const lower = text.toLowerCase();

    // 1. Direct hit in curated Academic Words DB
    if (ACADEMIC_WORDS_DB[lower]?.translationUz) {
      return NextResponse.json({
        success: true,
        translation: ACADEMIC_WORDS_DB[lower].translationUz,
        source: 'curated_database',
      });
    }

    // 2. Cascade through multi-tier translator (Offline -> Google GTX -> Chrome Dict -> MyMemory)
    const translation = await getAccurateUzbekTranslation(text);

    if (translation) {
      return NextResponse.json({
        success: true,
        translation,
        source: 'translator_engine',
      });
    }

    return NextResponse.json({
      success: false,
      translation: '',
      error: 'Tarjima topilmadi',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Serverda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
