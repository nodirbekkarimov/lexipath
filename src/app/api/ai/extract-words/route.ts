import { NextResponse } from 'next/server';
import { extractAcademicWordsFromText } from '@/lib/nlp/text-extractor';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const words = extractAcademicWordsFromText(text);

    return NextResponse.json({
      success: true,
      count: words.length,
      data: words.slice(0, 30), // Top 30 most academic words
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Extraction failed' }, { status: 500 });
  }
}
