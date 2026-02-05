interface TranslateOptions {
  text: string;
  source?: string;
  target?: string;
}

const translationCache = new Map<string, string>();

function getCacheKey(text: string, source: string, target: string): string {
  return `${source}:${target}:${text}`;
}

function loadCacheFromStorage() {
  if (typeof window === 'undefined') return;

  try {
    const cached = localStorage.getItem('translation_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      Object.entries(parsed).forEach(([key, value]) => {
        translationCache.set(key, value as string);
      });
    }
  } catch (error) {
    console.error('Failed to load cache:', error);
  }
}

function saveCacheToStorage() {
  if (typeof window === 'undefined') return;

  try {
    const cacheObj: Record<string, string> = {};
    translationCache.forEach((value, key) => {
      cacheObj[key] = value;
    });
    localStorage.setItem('translation_cache', JSON.stringify(cacheObj));
  } catch (error) {
    console.error('Failed to save cache:', error);
  }
}

if (typeof window !== 'undefined') {
  loadCacheFromStorage();
}

export async function translate(options: TranslateOptions): Promise<string> {
  const { text, source = 'en', target = 'hi' } = options;

  if (!text || text.trim() === '') {
    return text;
  }

  const cacheKey = getCacheKey(text.trim(), source, target);

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();

    if (data && data[0] && data[0][0] && data[0][0][0]) {
      const translatedText = data[0][0][0];
      translationCache.set(cacheKey, translatedText);

      if (translationCache.size % 20 === 0) {
        saveCacheToStorage();
      }

      return translatedText;
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

  const results: string[] = new Array(texts.length);
  const toTranslate: { index: number; text: string }[] = [];

  texts.forEach((text, index) => {
    const cacheKey = getCacheKey(text.trim(), source, target);
    if (translationCache.has(cacheKey)) {
      results[index] = translationCache.get(cacheKey)!;
    } else {
      toTranslate.push({ index, text });
    }
  });

  if (toTranslate.length === 0) {
    return results;
  }

  const promises = toTranslate.map(async ({ index, text }) => {
    const translated = await translate({ text, source, target });
    results[index] = translated;
  });

  await Promise.all(promises);

  saveCacheToStorage();

  return results;
}

export function clearTranslationCache() {
  translationCache.clear();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('translation_cache');
  }
}
