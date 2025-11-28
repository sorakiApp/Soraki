
import React, { useState, useRef } from 'react';
import { UserProfile } from '../../types';
import { ArrowRight, Upload, Check, Smartphone } from 'lucide-react';
import MascotPlaceholder from '../UI/MascotPlaceholder';
import { useData } from '../../contexts/dataContext';
import LanguageSwitcher from '../UI/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Onboarding: React.FC = () => {
  const { t } = useTranslation();
  const { updateUserProfile } = useData();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [studyGoal, setStudyGoal] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (step === 0 && !name.trim()) return;
    setStep(prev => prev + 1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = () => {
    updateUserProfile({
      name,
      age,
      studyGoal,
      avatar
    });
  };

  return (
    <div className="min-h-screen bg-soraki-bg flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md">
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-soraki-primary' : 'w-2 bg-soraki-neutral'}`} />
          ))}
        </div>

        <div className="bg-soraki-card rounded-[32px] p-8 shadow-float border border-soraki-primaryLight/20 relative overflow-hidden">
          
          {/* Step 0: Name */}
          {step === 0 && (
            <div className="flex flex-col items-center text-center animate-fade-in">
              <MascotPlaceholder mood="happy" size="md" className="mb-6" />
              <h2 className="text-2xl font-bold text-soraki-primaryDark mb-2">{t('onboarding.welcome')}</h2>
              <p className="text-soraki-textLight text-sm mb-8">{t('onboarding.intro')}</p>
              
              <input
                autoFocus
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
                placeholder={t('onboarding.namePlaceholder')}
                className="w-full bg-soraki-bg border-2 border-soraki-neutral focus:border-soraki-primary rounded-xl px-4 py-3 text-center font-bold text-soraki-primaryDark outline-none transition-colors mb-6"
              />
              
              <button 
                onClick={handleNext}
                disabled={!name.trim()}
                className="bg-soraki-primary text-white w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-soraki-primaryDark transition-colors disabled:opacity-50"
              >
                {t('onboarding.continue')} <ArrowRight size={20} />
              </button>

              <div className="mt-8">
                <LanguageSwitcher />
              </div>
            </div>
          )}

          {/* Step 1: Avatar */}
          {step === 1 && (
            <div className="flex flex-col items-center text-center animate-fade-in">
              <h2 className="text-2xl font-bold text-soraki-primaryDark mb-2">{t('onboarding.avatar.title')}</h2>
              <p className="text-soraki-textLight text-sm mb-8">{t('onboarding.avatar.subtitle')}</p>
              
              <div 
                className="relative w-32 h-32 rounded-full bg-soraki-bg border-4 border-dashed border-soraki-neutral flex items-center justify-center mb-8 cursor-pointer overflow-hidden group hover:border-soraki-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatar ? (
                  <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-soraki-textLight group-hover:text-soraki-primary">
                    <Upload size={24} />
                    <span className="text-xs mt-2 font-bold">{t('onboarding.avatar.upload')}</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />

              <div className="space-y-3 w-full">
                <button 
                  onClick={handleNext}
                  className="bg-soraki-primary text-white w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-soraki-primaryDark transition-colors"
                >
                  {avatar ? t('onboarding.avatar.looksGreat') : t('onboarding.continue')} <ArrowRight size={20} />
                </button>
                
                {!avatar && (
                  <button 
                    onClick={handleNext}
                    className="text-soraki-textLight text-sm font-medium hover:text-soraki-text"
                  >
                    {t('onboarding.avatar.skip')}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Details & PWA Tip */}
          {step === 2 && (
            <div className="flex flex-col items-center text-center animate-fade-in">
              <h2 className="text-2xl font-bold text-soraki-primaryDark mb-2">{t('onboarding.details.title', { name })}</h2>
              <p className="text-soraki-textLight text-sm mb-6">{t('onboarding.details.subtitle')}</p>
              
              <div className="w-full space-y-4 mb-6">
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  placeholder={t('onboarding.details.agePlaceholder')}
                  className="w-full bg-soraki-bg border-2 border-soraki-neutral focus:border-soraki-primary rounded-xl px-4 py-3 font-medium text-soraki-text outline-none transition-colors"
                />
                <input
                  type="text"
                  value={studyGoal}
                  onChange={e => setStudyGoal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleFinish()}
                  placeholder={t('onboarding.details.goalPlaceholder')}
                  className="w-full bg-soraki-bg border-2 border-soraki-neutral focus:border-soraki-primary rounded-xl px-4 py-3 font-medium text-soraki-text outline-none transition-colors"
                />
              </div>

              {/* PWA Installation Tip */}
              <div className="bg-soraki-primary/10 border border-soraki-primary/20 rounded-xl p-4 flex items-center gap-3 text-left mb-6 w-full">
                  <Smartphone size={40} className="text-soraki-primaryDark flex-shrink-0" />
                  <div>
                      <h4 className="font-bold text-sm text-soraki-primaryDark">{t('onboarding.pwa.title')}</h4>
                      <p className="text-xs text-soraki-text leading-tight mt-1" dangerouslySetInnerHTML={{ __html: t('onboarding.pwa.description') }} />
                  </div>
              </div>
              
              <button 
                onClick={handleFinish}
                disabled={!age.trim() || !studyGoal.trim()}
                className="bg-soraki-primary text-white w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-soraki-primaryDark transition-colors disabled:opacity-50"
              >
                {t('onboarding.start')} <Check size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
