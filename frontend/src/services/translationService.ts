// Translation service using Google Translate API (free tier via unofficial endpoint)
// Note: For production, use official Google Cloud Translation API

const GOOGLE_TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single';

interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
}

export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'auto'
): Promise<TranslationResult> {
  try {
    const params = new URLSearchParams({
      client: 'gtx',
      sl: sourceLanguage,
      tl: targetLanguage,
      dt: 't',
      q: text,
    });

    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error('Translation request failed');
    }

    const data = await response.json();
    
    // Parse Google Translate response
    // Response format: [[["translated text","original text",null,null,10]],null,"detected_lang"]
    const translatedText = data[0]
      ?.map((item: any[]) => item[0])
      .join('') || text;
    
    const detectedLanguage = data[2] || sourceLanguage;

    return {
      translatedText,
      detectedLanguage,
    };
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text if translation fails
    return {
      translatedText: text,
      detectedLanguage: sourceLanguage,
    };
  }
}

// Batch translate multiple texts
export async function translateBatch(
  texts: string[],
  targetLanguage: string,
  sourceLanguage: string = 'auto'
): Promise<TranslationResult[]> {
  const results = await Promise.all(
    texts.map((text) => translateText(text, targetLanguage, sourceLanguage))
  );
  return results;
}

// Language detection
export async function detectLanguage(text: string): Promise<string> {
  const result = await translateText(text, 'en', 'auto');
  return result.detectedLanguage || 'unknown';
}

// Language code to flag emoji mapping
export const languageFlags: Record<string, string> = {
  ko: '🇰🇷',
  en: '🇺🇸',
  ja: '🇯🇵',
  zh: '🇨🇳',
  'zh-CN': '🇨🇳',
  'zh-TW': '🇹🇼',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
  pt: '🇵🇹',
  ru: '🇷🇺',
  ar: '🇸🇦',
  hi: '🇮🇳',
  th: '🇹🇭',
  vi: '🇻🇳',
};

export function getLanguageFlag(langCode: string): string {
  return languageFlags[langCode] || '🌐';
}

// Language names
export const languageNames: Record<string, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  ar: 'العربية',
  hi: 'हिन्दी',
  th: 'ไทย',
  vi: 'Tiếng Việt',
};

export function getLanguageName(langCode: string): string {
  return languageNames[langCode] || langCode;
}
