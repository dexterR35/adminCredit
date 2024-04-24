// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './utils/json/En.json';
import translationRO from './utils/json/Ro.json';

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  ro: {
    translation: translationRO,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // fallback language is English
    debug: true,

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
