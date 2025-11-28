
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button onClick={() => changeLanguage('pt')} disabled={i18n.language === 'pt'} className="px-3 py-1 rounded-md bg-soraki-primary text-white disabled:bg-soraki-primaryLight">
        PT
      </button>
      <button onClick={() => changeLanguage('en')} disabled={i18n.language === 'en'} className="px-3 py-1 rounded-md bg-soraki-primary text-white disabled:bg-soraki-primaryLight">
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
