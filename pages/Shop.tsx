
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Shop: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-24 h-full justify-center">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-soraki-primaryDark">{t('shop.title')}</h2>
        <div className="text-soraki-textLight text-sm mt-4 max-w-sm mx-auto flex flex-col gap-4">
            <p>{t('shop.support')}</p>
            <p>{t('shop.description')}</p>
            <p>{t('shop.visit')}</p>
        </div>
      </div>

      {/* External Shop */}
      <div 
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-lg cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-transform"
        onClick={() => window.open('https://soraki-catalogo.vercel.app/', '_blank')}
      >
        <div className="relative z-10 flex flex-col items-center text-center gap-4">
             <div className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold inline-block text-white uppercase tracking-widest">
                 {t('shop.external.label')}
             </div>
             
             <div>
                 <h3 className="font-bold text-2xl mb-2">{t('shop.external.title')}</h3>
                 <p className="text-indigo-100 text-sm max-w-[260px] mx-auto leading-relaxed">
                    {t('shop.external.description')}
                 </p>
             </div>

             <div className="mt-4 bg-white text-indigo-600 px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2">
                <span>{t('shop.external.button')}</span>
                <ExternalLink size={18} />
             </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-400/20 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default Shop;
