import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'p-6', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-soraki-card rounded-[32px] shadow-card border border-soraki-card/50 ${padding} ${className} ${onClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''}`}
    >
      {children}
    </div>
  );
};

export default Card;