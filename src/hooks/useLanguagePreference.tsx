import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export interface LanguagePreference {
  code: string;
  name: string;
  regionCode: string;
}

export const SUPPORTED_LANGUAGES: LanguagePreference[] = [
  { code: 'en', name: 'English', regionCode: 'US' },
  { code: 'es', name: 'Spanish', regionCode: 'ES' },
  { code: 'fr', name: 'French', regionCode: 'FR' },
  { code: 'de', name: 'German', regionCode: 'DE' },
  { code: 'pt', name: 'Portuguese', regionCode: 'BR' },
  { code: 'it', name: 'Italian', regionCode: 'IT' },
  { code: 'ja', name: 'Japanese', regionCode: 'JP' },
  { code: 'ko', name: 'Korean', regionCode: 'KR' },
  { code: 'zh', name: 'Chinese', regionCode: 'CN' },
  { code: 'hi', name: 'Hindi', regionCode: 'IN' },
  { code: 'ar', name: 'Arabic', regionCode: 'SA' },
  { code: 'ru', name: 'Russian', regionCode: 'RU' },
];

const STORAGE_KEY = 'epishow_language_preference';

interface LanguageContextType {
  language: LanguagePreference;
  setLanguage: (lang: LanguagePreference) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguagePreference>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return SUPPORTED_LANGUAGES[0]; // Default to English
      }
    }
    return SUPPORTED_LANGUAGES[0];
  });

  const setLanguage = (lang: LanguagePreference) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lang));
    // Clear video cache to refetch with new language
    window.dispatchEvent(new CustomEvent('language-changed'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguagePreference() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguagePreference must be used within LanguageProvider');
  }
  return context;
}

// For use outside React components
export function getStoredLanguage(): LanguagePreference {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return SUPPORTED_LANGUAGES[0];
    }
  }
  return SUPPORTED_LANGUAGES[0];
}
