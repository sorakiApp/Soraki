import React from 'react';

interface MascotProps {
  mood?: 'happy' | 'study' | 'sleep' | 'peek';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const MascotPlaceholder: React.FC<MascotProps> = ({ mood = 'happy', size = 'md', className = '' }) => {
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  // Relative path to the resources folder from components/UI/
  // This ensures it looks up two levels to root, then into resources
  const imageSrc = '../../resources/soraki.png';

  return (
    <div className={`relative rounded-full overflow-hidden border-4 border-white dark:border-soraki-card flex-shrink-0 mx-auto ${sizeClasses[size]} ${className}`}>
       <img 
         src={imageSrc} 
         alt={`Soraki ${mood}`} 
         className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
       />
    </div>
  );
};

export default MascotPlaceholder;