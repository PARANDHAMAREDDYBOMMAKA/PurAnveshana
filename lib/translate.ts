interface TranslateOptions {
  text: string;
  source?: string;
  target?: string;
}

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

export async function translate(options: TranslateOptions): Promise<string> {
  const { text, source = 'en', target = 'hi' } = options;

  if (!text || text.trim() === '') {
    return text;
  }

  try {
    const url = `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();

    if (data.responseStatus === 200 || data.responseData) {
      return data.responseData.translatedText;
    }

    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

export async function translateBatch(texts: string[], source = 'en', target = 'hi'): Promise<string[]> {
  if (!texts || texts.length === 0) {
    return texts;
  }

  try {
    const promises = texts.map(text => translate({ text, source, target }));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts;
  }
}
