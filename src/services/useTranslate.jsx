// useTranslate.js

import { useTranslation as useTranslationBase } from 'react-i18next';

const useTranslate = () => {
  const { t, i18n } = useTranslationBase(); // Deconstructing t (translation function) and i18n (i18n instance)

  return { t, i18n }; // Returning t and i18n for use in components
};

export default useTranslate;
