'use client';

import { useState, useEffect, useCallback } from 'react';
import { Locale, getTranslation, Translations } from './i18n';

const LOCALE_STORAGE_KEY = 'mcp-on-edge-locale';

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'zh';
  }
  
  // Try to get from localStorage first
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === 'zh' || stored === 'en') {
    return stored;
  }
  
  // Fallback to browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }
  return 'en';
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>('zh');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialLocale = getInitialLocale();
    setLocaleState(initialLocale);
    setIsInitialized(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      // Update html lang attribute
      document.documentElement.lang = newLocale === 'zh' ? 'zh-CN' : 'en';
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'zh' ? 'en' : 'zh');
  }, [locale, setLocale]);

  const t: Translations = getTranslation(locale);

  return {
    locale,
    setLocale,
    toggleLocale,
    t,
    isInitialized,
  };
}
