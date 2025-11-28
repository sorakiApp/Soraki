
import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import MascotPlaceholder from '../components/UI/MascotPlaceholder';
import { UserProfile } from '../types';
import { useData } from '../contexts/dataContext';
import { useTranslation } from 'react-i18next';

interface FocusProps {
    userProfile: UserProfile;
}

const Focus: React.FC<FocusProps> = ({ userProfile }) => {
  const { t } = useTranslation();
  const { addFocusSession } = useData();
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [subject, setSubject] = useState(t('focus.subject.general'));
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // SVG Circle Logic
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / (duration * 60);
  const dashOffset = circumference - progress * circumference;

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setSessionCompleted(false);
  }, [duration]);

  useEffect(() => {
    resetTimer();
  }, [duration, resetTimer]);

  // Finish Logic
  const handleFinish = useCallback(() => {
    setIsActive(false);
    setSessionCompleted(true);
    addFocusSession(duration);
  }, [addFocusSession, duration]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      handleFinish();
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, timeLeft, handleFinish]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center animate-fade-in pb-24 w-full">
      <div className="text-center mt-4 mb-8">
         <h2 className="text-2xl font-bold text-soraki-primaryDark">{t('focus.title')}</h2>
         <p className="text-soraki-textLight text-sm">{t('focus.subtitle')}</p>
      </div>

      {sessionCompleted && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl text-center animate-fade-in shadow-soft">
              <p className="font-bold text-lg">{t('focus.completed.title', { name: userProfile.name })}</p>
              <p className="text-sm">{t('focus.completed.body', { duration })}</p>
              <button 
                onClick={resetTimer}
                className="mt-3 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-bold"
              >
                {t('focus.completed.new')}
              </button>
          </div>
      )}

      {/* Circular Timer */}
      <div className="relative w-[300px] h-[300px] flex items-center justify-center mb-8">
         {/* Background Circle */}
         <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90 drop-shadow-xl">
            <circle
              cx="150"
              cy="150"
              r={radius}
              className="fill-soraki-card stroke-soraki-surface"
              strokeWidth="15"
            />
            {/* Progress Circle */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              fill="none"
              className="stroke-soraki-primary"
              strokeWidth="15"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: dashOffset,
                transition: 'stroke-dashoffset 1s linear'
              }}
            />
         </svg>
         
         {/* Inner Content */}
         <div className="relative z-10 flex flex-col items-center">
            <div className="mb-4 transition-transform duration-500">
                <MascotPlaceholder size="md" mood={isActive ? 'study' : 'peek'} />
            </div>
            <div className="text-6xl font-light text-soraki-primaryDark tracking-tighter font-mono">
                {formatTime(timeLeft)}
            </div>
            <div className="text-soraki-textLight text-sm mt-1 font-medium bg-soraki-card/80 px-3 py-1 rounded-full border border-soraki-neutral">
                {isActive ? t('focus.status.focusing', { subject }) : t('focus.status.ready')}
            </div>
         </div>
      </div>

      {/* Controls */}
      {!sessionCompleted && (
          <div className="w-full max-w-xs space-y-6">
            {!isActive && (
                <div className="flex gap-3 justify-center animate-fade-in">
                    <div className="relative">
                        <select 
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="appearance-none bg-soraki-card border border-soraki-primaryLight pl-4 pr-8 py-2 rounded-xl text-soraki-text text-sm font-bold focus:outline-none shadow-sm"
                        >
                            <option value={5}>{`5 min (${t('focus.duration.test')})`}</option>
                            <option value={15}>15 min</option>
                            <option value={25}>25 min</option>
                            <option value={45}>45 min</option>
                            <option value={60}>60 min</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-soraki-primaryDark">▼</div>
                    </div>
                    
                    <div className="relative">
                        <select 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="appearance-none bg-soraki-card border border-soraki-primaryLight pl-4 pr-8 py-2 rounded-xl text-soraki-text text-sm font-bold focus:outline-none shadow-sm"
                        >
                            <option>{t('focus.subject.general')}</option>
                            <option>{t('focus.subject.math')}</option>
                            <option>{t('focus.subject.history')}</option>
                            <option>{t('focus.subject.reading')}</option>
                        </select>
                         <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-soraki-primaryDark">▼</div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-center gap-4">
                {isActive && (
                    <button onClick={toggleTimer} className="w-14 h-14 rounded-full bg-soraki-card text-orange-400 shadow-soft flex items-center justify-center hover:bg-orange-50 transition-colors">
                        <Pause fill="currentColor" size={24} />
                    </button>
                )}
                
                {!isActive && (
                     <button 
                        onClick={toggleTimer}
                        className="w-20 h-20 rounded-[28px] bg-soraki-primary text-white shadow-float flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                    >
                        <Play fill="currentColor" size={32} className="ml-1" />
                    </button>
                )}

                 {isActive && (
                     <button onClick={resetTimer} className="w-14 h-14 rounded-full bg-soraki-card text-gray-400 shadow-soft flex items-center justify-center hover:bg-soraki-surface transition-colors">
                        <RotateCcw size={22} />
                    </button>
                 )}
            </div>
          </div>
      )}
    </div>
  );
};

export default Focus;
