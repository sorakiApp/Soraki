
import React from 'react';
import UserAvatar from '../UI/UserAvatar';
import { UserProfile } from '../../types';

interface HeaderProps {
  userProfile?: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ userProfile }) => {
  return (
    <div className="flex justify-between items-center py-4 px-6 sticky top-0 z-40 bg-soraki-bg/95 backdrop-blur-sm transition-all duration-300 border-b border-transparent dark:border-soraki-neutral/50">
      <div className="flex items-center gap-3">
        <UserAvatar 
          profileImage={userProfile?.avatar} 
          size="sm" 
          className="!border-2 border-soraki-primary"
        />
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-soraki-primaryDark leading-none">Soraki</h1>
          <div className="flex items-center gap-1 text-xs text-soraki-textLight mt-1">
            <span>study buddy</span>
            <span>✨</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;