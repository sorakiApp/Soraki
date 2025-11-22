import React from 'react';
import MascotPlaceholder from './MascotPlaceholder';

interface UserAvatarProps {
  profileImage?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  mood?: 'happy' | 'study' | 'sleep' | 'peek'; // Fallback mood
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  profileImage, 
  size = 'md', 
  className = '',
  mood = 'happy'
}) => {
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  if (profileImage) {
    return (
      <div className={`relative rounded-full overflow-hidden border-2 border-soraki-neutral dark:border-soraki-card flex-shrink-0 object-cover ${sizeClasses[size]} ${className}`}>
        <img 
          src={profileImage} 
          alt="User Avatar" 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <MascotPlaceholder size={size} mood={mood} className={className} />
  );
};

export default UserAvatar;