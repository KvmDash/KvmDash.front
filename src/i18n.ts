import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)  // Erkennt Browser-Sprache automatisch
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['de', 'en'],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],  // Speichert Sprachauswahl
      lookupLocalStorage: 'i18nextLng',
    },
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    }
  });

export default i18n;