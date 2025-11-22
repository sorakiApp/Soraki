
import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card';
import { Plus, Lightbulb, ArrowRight, BrainCircuit, Trash2, X, Check, Frown, Meh, Smile } from 'lucide-react';
import MascotPlaceholder from '../components/UI/MascotPlaceholder';
import { ReviewItem } from '../types';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  
  // Study Mode State
  const [studyingItem, setStudyingItem] = useState<ReviewItem | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Persistence
  useEffect(() => {
      const saved = localStorage.getItem('soraki-reviews');
      if (saved) setReviews(JSON.parse(saved));
  }, []);

  useEffect(() => {
      localStorage.setItem('soraki-reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = () => {
      if (!newTopic.trim()) return;
      const newItem: ReviewItem = {
          id: Date.now().toString(),
          title: newTopic,
          subject: 'Geral',
          level: 0,
          interval: 0,
          nextReview: new Date().toISOString() // Due immediately
      };
      setReviews([...reviews, newItem]);
      setNewTopic('');
      setIsAdding(false);
  };

  const deleteReview = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setReviews(reviews.filter(r => r.id !== id));
  }

  // --- SRS LOGIC ---

  const startSession = (item: ReviewItem) => {
    setStudyingItem(item);
    setShowAnswer(false);
  };

  const processResult = (difficulty: 'hard' | 'good' | 'easy') => {
    if (!studyingItem) return;

    let newInterval = 1;
    let newLevel = studyingItem.level;

    // Simple SRS Algorithm
    if (difficulty === 'hard') {
        newInterval = 1; // Reset to 1 day
        newLevel = 1;
    } else if (difficulty === 'good') {
        newInterval = Math.ceil(Math.max(1, studyingItem.interval) * 1.5);
        newLevel = studyingItem.level + 1;
    } else if (difficulty === 'easy') {
        newInterval = Math.ceil(Math.max(1, studyingItem.interval) * 2.5);
        newLevel = studyingItem.level + 2;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + newInterval);

    const updatedReviews = reviews.map(r => {
        if (r.id === studyingItem.id) {
            return {
                ...r,
                interval: newInterval,
                level: newLevel,
                nextReview: nextDate.toISOString()
            };
        }
        return r;
    });

    setReviews(updatedReviews);
    setStudyingItem(null); // Close modal
  };

  const getDaysUntilDue = (dateStr: string) => {
    const due = new Date(dateStr);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  return (
    <div className="flex flex-col h-full animate-fade-in pb-24">
       {/* Header */}
       <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-3xl font-bold text-soraki-primaryDark">Revisões</h2>
            <p className="text-soraki-textLight text-sm">não esqueça do que aprendeu 🧠</p>
        </div>
        <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-soraki-secondary text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-soft transition-colors flex items-center gap-1 hover:bg-soraki-primaryDark"
        >
            <Plus size={14} /> {isAdding ? 'Cancelar' : 'Nova'}
        </button>
      </div>

      {/* Add New Input */}
      {isAdding && (
          <div className="mb-4 flex gap-2 animate-fade-in">
              <input 
                autoFocus
                className="flex-1 bg-soraki-card border border-soraki-neutral rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-soraki-primary/50"
                placeholder="Tópico para revisar..."
                value={newTopic}
                onChange={e => setNewTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addReview()}
              />
              <button onClick={addReview} className="bg-soraki-primaryDark text-white px-4 rounded-xl font-bold text-xs">OK</button>
          </div>
      )}

      {/* Review List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
            {reviews.map(review => {
                const daysUntil = getDaysUntilDue(review.nextReview);
                const isDue = daysUntil <= 0;

                return (
                    <Card key={review.id} className="flex flex-col gap-3 relative overflow-hidden group" padding="p-5">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-indigo-50 text-indigo-500 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border border-indigo-100">
                                        Nível {review.level}
                                    </span>
                                    {!isDue && (
                                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                            <ClockIcon size={10} /> Daqui a {daysUntil} dia(s)
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-lg font-bold text-soraki-primaryDark leading-tight">{review.title}</h4>
                            </div>
                            <button onClick={(e) => deleteReview(review.id, e)} className="text-gray-300 hover:text-red-400 p-1">
                                 <Trash2 size={16} />
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => startSession(review)}
                            disabled={!isDue}
                            className={`mt-2 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                isDue 
                                ? 'bg-soraki-primary/10 text-soraki-primaryDark hover:bg-soraki-primary hover:text-white cursor-pointer' 
                                : 'bg-soraki-neutral/30 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {isDue ? (
                                <>Iniciar Revisão <ArrowRight size={16} /></>
                            ) : (
                                <>Volte em {daysUntil} dia{daysUntil > 1 ? 's' : ''}</>
                            )}
                        </button>
                    </Card>
                );
            })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 mt-8">
            <MascotPlaceholder mood="sleep" size="sm" className="mb-4 opacity-80" />
            <p className="text-soraki-text font-medium mb-2">Nenhuma revisão cadastrada.</p>
            <p className="text-xs text-soraki-textLight max-w-[200px]">Adicione tópicos que você estudou hoje para revisarmos depois.</p>
        </div>
      )}

      {/* --- STUDY MODE MODAL --- */}
      {studyingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setStudyingItem(null)}></div>
            
            <div className="bg-soraki-bg w-full max-w-md rounded-[32px] shadow-2xl p-6 relative z-10 flex flex-col items-center min-h-[400px]">
                <button onClick={() => setStudyingItem(null)} className="absolute top-4 right-4 text-soraki-textLight hover:text-soraki-text p-2">
                    <X size={24} />
                </button>

                <h3 className="text-sm font-bold text-soraki-textLight uppercase tracking-widest mb-8 mt-2">Modo Estudo</h3>

                <MascotPlaceholder mood={showAnswer ? "happy" : "peek"} size="md" className="mb-6" />

                <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <h2 className="text-2xl font-bold text-center text-soraki-primaryDark mb-4 px-4">
                        {studyingItem.title}
                    </h2>
                    
                    {!showAnswer ? (
                        <p className="text-soraki-textLight text-center text-sm italic">
                            Tente explicar este tópico mentalmente...
                        </p>
                    ) : (
                        <div className="text-center animate-fade-in">
                            <p className="text-soraki-text font-medium mb-2">Como foi sua memória?</p>
                            <p className="text-xs text-soraki-textLight">Seja sincero para o algoritmo funcionar!</p>
                        </div>
                    )}
                </div>

                <div className="w-full mt-8">
                    {!showAnswer ? (
                        <button 
                            onClick={() => setShowAnswer(true)}
                            className="w-full bg-soraki-primary text-white py-4 rounded-2xl font-bold shadow-soft hover:scale-[1.02] transition-transform"
                        >
                            Verificar
                        </button>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            <button 
                                onClick={() => processResult('hard')}
                                className="flex flex-col items-center justify-center gap-1 bg-red-50 text-red-500 py-3 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors"
                            >
                                <Frown size={20} />
                                <span className="text-xs font-bold">Difícil</span>
                            </button>
                            <button 
                                onClick={() => processResult('good')}
                                className="flex flex-col items-center justify-center gap-1 bg-blue-50 text-blue-500 py-3 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-colors"
                            >
                                <Meh size={20} />
                                <span className="text-xs font-bold">Bom</span>
                            </button>
                            <button 
                                onClick={() => processResult('easy')}
                                className="flex flex-col items-center justify-center gap-1 bg-green-50 text-green-500 py-3 rounded-2xl border border-green-100 hover:bg-green-100 transition-colors"
                            >
                                <Smile size={20} />
                                <span className="text-xs font-bold">Fácil</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const ClockIcon = ({size}: {size:number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

export default Reviews;