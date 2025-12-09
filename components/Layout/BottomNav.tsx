import React from 'react';
import { Home, BookOpen, Clock, RotateCcw, ShoppingBag, User, HandHeartIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/planner', icon: BookOpen, label: t('nav.planner') },
    { path: '/focus', icon: Clock, label: t('nav.focus') },
    { path: '/reviews', icon: RotateCcw, label: t('nav.reviews') },
    { path: '/shop', icon: HandHeartIcon, label: t('nav.shop') },
    { path: '/profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-soraki-card border-t border-soraki-neutral pb-safe pt-2 px-4 z-50 max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300">
      <div className="flex justify-between items-center pb-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-12 transition-all duration-200 ${
                isActive ? 'text-soraki-primaryDark' : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              <div className={`p-1.5 rounded-xl mb-1 transition-all duration-300 ${
                isActive ? 'bg-soraki-surface transform scale-110' : 'bg-transparent'
              }`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;