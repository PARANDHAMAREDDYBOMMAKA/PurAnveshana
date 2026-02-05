import { NextRequest, NextResponse } from 'next/server';
import { translate } from '@/lib/translate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, source = 'en', target = 'hi' } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const translatedText = await translate({ text, source, target });

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}
