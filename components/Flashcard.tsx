
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReviewItem, ReviewDifficulty } from '../types';

interface FlashcardProps {
  card: ReviewItem;
  onReview: (difficulty: ReviewDifficulty) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, onReview }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setShowDifficulty(true);
    }
  };

  const handleReview = (difficulty: ReviewDifficulty) => {
    onReview(difficulty);
    setIsFlipped(false);
    setShowDifficulty(false);
  };

  const difficultyButtons: { label: string; value: ReviewDifficulty, color: string }[] = [
    { label: 'Errei', value: 'muito-dificil', color: 'bg-red-500 hover:bg-red-600' },
    { label: 'Difícil', value: 'dificil', color: 'bg-orange-500 hover:bg-orange-600' },
    { label: 'Fácil', value: 'facil', color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'Muito Fácil', value: 'muito-facil', color: 'bg-green-500 hover:bg-green-600' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md h-64 cursor-pointer"
        style={{ perspective: 1000 }}
        onClick={handleFlip}
      >
        <motion.div
          className="relative w-full h-full transition-transform duration-700"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
        >
          {/* Frente do Card */}
          <div className="absolute w-full h-full backface-hidden bg-soraki-card rounded-xl shadow-lg flex items-center justify-center p-6">
            <p className="text-xl text-center font-semibold text-soraki-text-light">{card.front}</p>
          </div>
          {/* Verso do Card */}
          <div className="absolute w-full h-full backface-hidden bg-soraki-card rounded-xl shadow-lg flex items-center justify-center p-6"
               style={{ transform: 'rotateY(180deg)' }}>
            <p className="text-lg text-center text-soraki-text-light">{card.back}</p>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showDifficulty && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-3 w-full max-w-md"
          >
            <h3 className="w-full text-center text-sm text-soraki-text-light mb-2">Qual o nível de dificuldade?</h3>
            {difficultyButtons.map(({label, value, color}) => (
                <button 
                    key={value} 
                    onClick={(e) => { 
                        e.stopPropagation(); // Evita que o card vire de volta
                        handleReview(value);
                    }}
                    className={`${color} text-white font-bold py-3 px-5 rounded-lg text-sm shadow-md transition-transform transform hover:scale-105`}
                >
                    {label}
                </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Flashcard;
