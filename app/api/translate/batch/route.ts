import { NextRequest, NextResponse } from 'next/server';
import { translateBatch } from '@/lib/translate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { texts, source = 'en', target = 'hi' } = body;

    if (!texts || !Array.isArray(texts)) {
      return NextResponse.json(
        { error: 'Texts array is required' },
        { status: 400 }
      );
    }

    const translatedTexts = await translateBatch(texts, source, target);

    return NextResponse.json({ translatedTexts });
  } catch (error) {
    console.error('Batch translation API error:', error);
    return NextResponse.json(
      { error: 'Batch translation failed' },
      { status: 500 }
    );
  }
}
