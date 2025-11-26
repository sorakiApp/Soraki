
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, X, BrainCircuit } from 'lucide-react';
import MascotPlaceholder from '../components/UI/MascotPlaceholder';
import { ReviewItem, ReviewDifficulty } from '../types';
import { useData } from '../contexts/dataContext';
import Flashcard from '../components/Flashcard';
import { AnimatePresence, motion } from 'framer-motion';
import Card from '../components/UI/Card';

// Constantes do Algoritmo SRS
const MIN_EASE = 1.3;

const Reviews: React.FC = () => {
  const { reviews, addReview: addReviewContext, deleteReview: deleteReviewContext, updateReview } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  
  const [sessionInProgress, setSessionInProgress] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [feedbackInfo, setFeedbackInfo] = useState<{ message: string } | null>(null);

  const reviewQueue = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Considerar até o final do dia de hoje
    return reviews
      .filter(r => new Date(r.nextReview) <= today)
      .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());
  }, [reviews]);

  const currentCard = sessionInProgress ? reviewQueue[currentCardIndex] : null;

  const handleAddReview = () => {
      if (!newFront.trim() || !newBack.trim()) return;
      addReviewContext(newFront, newBack, 'Geral');
      setNewFront('');
      setNewBack('');
      setIsAdding(false);
  };

  const handleStartSession = () => {
    if (reviewQueue.length > 0) {
      setCurrentCardIndex(0);
      setFeedbackInfo(null); // Reseta o feedback ao iniciar
      setSessionInProgress(true);
    }
  }

  const handleContinue = () => {
    setFeedbackInfo(null); // Limpa a mensagem de feedback
    if (currentCardIndex < reviewQueue.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setSessionInProgress(false); // Fim da fila
    }
  };

  const processResult = (difficulty: ReviewDifficulty) => {
    if (!currentCard) return;

    let newInterval: number;
    let newEaseFactor: number = currentCard.easeFactor;
    let newLevel: number = currentCard.level;

    if (difficulty === 'muito-dificil' || difficulty === 'dificil') {
      newInterval = 1;
      newLevel = Math.max(0, newLevel - 1);
      newEaseFactor = Math.max(MIN_EASE, currentCard.easeFactor - 0.2);
    } else {
      newLevel++;
      if (currentCard.level === 0) {
        newInterval = 1;
      } else if (currentCard.level === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(currentCard.interval * newEaseFactor);
      }
      if(difficulty === 'facil') newEaseFactor = currentCard.easeFactor;
      if(difficulty === 'muito-facil') newEaseFactor = currentCard.easeFactor + 0.15;
    }
    
    const nextDate = new Date();
    nextDate.setHours(0, 0, 0, 0);
    nextDate.setDate(nextDate.getDate() + newInterval);

    const updatedReview: ReviewItem = {
        ...currentCard,
        interval: newInterval,
        level: newLevel,
        easeFactor: newEaseFactor,
        nextReview: nextDate.toISOString(),
    };

    updateReview(currentCard.id, updatedReview);

    const getNextReviewMessage = (interval: number) => {
      if (interval <= 1) return "Ele estará de volta para revisão amanhã. Bom trabalho!";
      return `Nos vemos de novo em ${interval} dias. Continue assim!`;
    }

    setFeedbackInfo({ message: getNextReviewMessage(newInterval) });
  };

  // Telas da Sessão
  const FeedbackScreen = ({ message, onContinue }: { message: string, onContinue: () => void }) => (
    <div className="flex flex-col items-center justify-center text-center p-8 h-full animate-fade-in">
      <MascotPlaceholder mood="happy" size="lg" className="mb-6" />
      <h2 className="text-2xl font-bold text-soraki-primaryDark">Revisão Registrada!</h2>
      <p className="text-soraki-textLight mt-2 mb-6 max-w-sm">{message}</p>
      <button 
        onClick={onContinue} 
        className="bg-soraki-primary text-white px-8 py-3 rounded-xl font-bold shadow-soft transition-transform hover:scale-105">
        Continuar
      </button>
    </div>
  );

  const SessionEndScreen = () => (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <MascotPlaceholder mood="celebrate" size="lg" className="mb-6" />
      <h2 className="text-2xl font-bold text-soraki-primaryDark">Parabéns!</h2>
      <p className="text-soraki-textLight mt-2 mb-6">Você concluiu sua sessão de revisão de hoje.</p>
      <button 
        onClick={() => setSessionInProgress(false)} 
        className="bg-soraki-primary text-white px-8 py-3 rounded-xl font-bold shadow-soft transition-transform hover:scale-105">
        Voltar
      </button>
    </div>
  );

  if (sessionInProgress) {
    return (
      <div className="w-full h-full flex flex-col">
          {feedbackInfo ? (
            <FeedbackScreen message={feedbackInfo.message} onContinue={handleContinue} />
          ) : currentCard ? (
            <>
              <div className='flex justify-between items-center px-4 pt-4'>
                <p className="text-sm font-semibold text-soraki-textLight">
                  Card {currentCardIndex + 1} de {reviewQueue.length}
                </p>
                <button onClick={() => { setSessionInProgress(false); setFeedbackInfo(null); }} className="text-soraki-textLight hover:text-soraki-text">
                  <X size={20} />
                </button>
              </div>
              <Flashcard key={currentCard.id} card={currentCard} onReview={processResult} />
            </>
          ) : (
            <SessionEndScreen />
          )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full animate-fade-in pb-24">
       <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-3xl font-bold text-soraki-primaryDark">Revisões</h2>
            <p className="text-soraki-textLight text-sm">cultive sua memória 🧠</p>
        </div>
        <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-soraki-secondary text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-soft transition-colors flex items-center gap-1 hover:bg-soraki-primaryDark"
        >
            <Plus size={14} /> {isAdding ? 'Cancelar' : 'Novo Card'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 bg-soraki-card rounded-2xl shadow-soft flex flex-col gap-3 p-4 overflow-hidden">
              <textarea
                className="w-full bg-soraki-bg border border-soraki-neutral rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-soraki-primary/50"
                placeholder="Frente (Pergunta ou Conceito)"
                rows={2}
                value={newFront}
                onChange={e => setNewFront(e.target.value)}
              />
              <textarea
                className="w-full bg-soraki-bg border border-soraki-neutral rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-soraki-primary/50"
                placeholder="Verso (Resposta)"
                rows={3}
                value={newBack}
                onChange={e => setNewBack(e.target.value)}
              />
              <div className='flex justify-end'>
                <button onClick={handleAddReview} className="bg-soraki-primaryDark text-white px-6 py-2 rounded-xl font-bold text-sm">Adicionar Card</button>
              </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card de Início da Sessão */}
      <Card className='mb-6' padding='p-5'>
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
                <BrainCircuit size={32} className="text-indigo-500" />
            </div>
            <div>
                <h3 className="font-bold text-soraki-primaryDark text-lg">Sessão de Revisão</h3>
                <p className="text-sm text-soraki-textLight">
                    {reviewQueue.length > 0 
                        ? `Você tem ${reviewQueue.length} card${reviewQueue.length > 1 ? 's' : ''} para revisar.`
                        : 'Nenhum card para revisar hoje. Bom descanso!'}
                </p>
            </div>
        </div>
        <button 
            onClick={handleStartSession}
            disabled={reviewQueue.length === 0}
            className="mt-4 w-full bg-soraki-primary text-white font-bold py-3 rounded-lg disabled:bg-soraki-neutral/50 disabled:cursor-not-allowed transition-all hover:bg-soraki-primaryDark"
        >
            Iniciar Revisão
        </button>
      </Card>
      

      {reviews.length > 0 ? (
        <div className='mt-4'>
            <h4 className="text-soraki-primaryDark font-bold mb-3">Todos os Cards</h4>
            <div className="space-y-2">
                {reviews.map(review => (
                  <div key={review.id} className='bg-soraki-card/50 p-3 rounded-lg flex justify-between items-center text-sm'>
                    <div>
                      <p className='font-semibold text-soraki-text'>{review.front}</p>
                      <p className='text-soraki-textLight text-xs'>{review.back}</p>
                    </div>
                    <button onClick={() => deleteReviewContext(review.id)} className="text-gray-400 hover:text-red-500 p-1 shrink-0 ml-2">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                ))}
            </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 mt-8">
            <MascotPlaceholder mood="sleep" size="sm" className="mb-4 opacity-80" />
            <p className="text-soraki-text font-medium mb-2">Nenhum card de revisão.</p>
            <p className="text-xs text-soraki-textLight max-w-[200px]">Crie seu primeiro flashcard para começar a memorizar.</p>
        </div>
      )}
    </div>
  );
};

export default Reviews;
