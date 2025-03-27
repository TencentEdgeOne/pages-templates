// Global Language Map
export const langMap: Record<string, string[]> = {
  'zh': ['zh-CN'],
  'zh-tw': ['zh-TW'],
  'ja': ['ja-JP'],
  'en': ['en-US'],
  'es': ['es-ES'],
  'ru': ['ru-RU'],
}

// Waline Language Map
// https://waline.js.org/guide/i18n.html
export const walineLocaleMap: Record<string, string> = {
  'zh': 'zh-CN',
  'zh-tw': 'zh-TW',
  'ja': 'jp-JP', // Waline uses jp-JP not ja-JP
  'en': 'en-US',
  'es': 'es-ES',
  'ru': 'ru-RU',
}

// Supported Languages
export const supportedLangs = Object.keys(langMap).flat()
