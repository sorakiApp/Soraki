
import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card';
import { Plus, ArrowRight, Trash2, X, Smile, Frown, Meh, Laugh } from 'lucide-react';
import MascotPlaceholder from '../components/UI/MascotPlaceholder';
import { ReviewItem, ReviewDifficulty } from '../types';

// Constantes do Algoritmo SRS
const MIN_EASE = 1.3;
const STARTING_EASE = 2.5;

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  
  const [studyingItem, setStudyingItem] = useState<ReviewItem | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

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
          easeFactor: STARTING_EASE,
          nextReview: new Date().toISOString()
      };
      setReviews([...reviews, newItem]);
      setNewTopic('');
      setIsAdding(false);
  };

  const deleteReview = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setReviews(reviews.filter(r => r.id !== id));
  }

  const startSession = (item: ReviewItem) => {
    setStudyingItem(item);
    setShowAnswer(false);
  };

  const processResult = (difficulty: ReviewDifficulty) => {
    if (!studyingItem) return;

    let newInterval: number;
    let newEaseFactor: number = studyingItem.easeFactor;
    let newLevel: number = studyingItem.level;

    switch (difficulty) {
        case 'muito-dificil':
            newEaseFactor = Math.max(MIN_EASE, studyingItem.easeFactor - 0.2);
            newInterval = 1;
            newLevel = studyingItem.level > 0 ? studyingItem.level - 1 : 0; // Pode regredir
            break;
        case 'dificil':
            newEaseFactor = Math.max(MIN_EASE, studyingItem.easeFactor - 0.15);
            newInterval = Math.round(studyingItem.interval * 0.5) || 1;
            break;
        case 'facil':
            newInterval = Math.round(studyingItem.interval * newEaseFactor);
            newLevel++;
            break;
        case 'muito-facil':
            newEaseFactor = studyingItem.easeFactor + 0.15;
            newInterval = Math.round(studyingItem.interval * newEaseFactor * 1.3);
            newLevel += 2;
            break;
    }
    
    if (studyingItem.level === 0) { // Primeira revisão
        if(difficulty === 'facil' || difficulty === 'muito-facil') newInterval = 1;
        else newInterval = 0; // Revisar de novo hoje
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + Math.max(1, newInterval));

    const updatedReviews = reviews.map(r => {
        if (r.id === studyingItem.id) {
            return {
                ...r,
                interval: newInterval,
                level: newLevel,
                easeFactor: newEaseFactor,
                nextReview: nextDate.toISOString()
            };
        }
        return r;
    });

    setReviews(updatedReviews);
    setStudyingItem(null);
  };

  const getDaysUntilDue = (dateStr: string) => {
    const due = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0); // Normalizar para o início do dia
    due.setHours(0,0,0,0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };
  
  const difficultyButtons: {id: ReviewDifficulty, label: string, icon: React.ReactNode, color: string}[] = [
    { id: 'muito-dificil', label: 'Errei feio', icon: <Frown size={20}/>, color: 'bg-red-50 text-red-500 border-red-100 hover:bg-red-100'},
    { id: 'dificil', label: 'Lembrei com esforço', icon: <Meh size={20}/>, color: 'bg-yellow-50 text-yellow-500 border-yellow-100 hover:bg-yellow-100'},
    { id: 'facil', label: 'Lembrei fácil', icon: <Smile size={20}/>, color: 'bg-blue-50 text-blue-500 border-blue-100 hover:bg-blue-100'},
    { id: 'muito-facil', label: 'Moleza!', icon: <Laugh size={20}/>, color: 'bg-green-50 text-green-500 border-green-100 hover:bg-green-100'},
  ];

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
            <Plus size={14} /> {isAdding ? 'Cancelar' : 'Nova'}
        </button>
      </div>

      {isAdding && (
          <div className="mb-4 p-4 bg-soraki-card rounded-2xl shadow-soft flex flex-col gap-2 animate-fade-in">
              <textarea
                autoFocus
                className="w-full bg-soraki-bg border border-soraki-neutral rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-soraki-primary/50"
                placeholder="Cole um texto e a Soraki sugere perguntas, ou apenas digite o tópico..."
                rows={3}
                value={newTopic}
                onChange={e => setNewTopic(e.target.value)}
              />
              <div className='flex justify-end'>
                <button onClick={addReview} className="bg-soraki-primaryDark text-white px-6 py-2 rounded-xl font-bold text-sm">Adicionar</button>
              </div>
          </div>
      )}

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
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${isDue ? 'bg-green-100 text-green-600 border-green-200' : 'bg-indigo-50 text-indigo-500 border-indigo-100'}`}>
                                       NÍVEL {review.level}
                                    </span>
                                     {!isDue && (
                                        <span className="text-[10px] text-gray-400">
                                            Próxima em {daysUntil} dia(s)
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-lg font-bold text-soraki-primaryDark leading-tight">{review.title}</h4>
                            </div>
                            <button onClick={(e) => deleteReview(review.id, e)} className="text-gray-300 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                <>Revisar Agora <ArrowRight size={16} /></>
                            ) : (
                                <>Disponível em {daysUntil} dia{daysUntil > 1 ? 's' : ''}</>
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
            <p className="text-xs text-soraki-textLight max-w-[200px]">Adicione tópicos que você estudou hoje para não esquecer.</p>
        </div>
      )}

      {studyingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setStudyingItem(null)}></div>
            <div className="bg-soraki-bg w-full max-w-md rounded-[32px] shadow-2xl p-6 relative z-10 flex flex-col items-center min-h-[400px]">
                <button onClick={() => setStudyingItem(null)} className="absolute top-4 right-4 text-soraki-textLight hover:text-soraki-text p-2">
                    <X size={24} />
                </button>
                <h3 className="text-sm font-bold text-soraki-textLight uppercase tracking-widest mb-8 mt-2">Modo Revisão</h3>
                <MascotPlaceholder mood={showAnswer ? "happy" : "peek"} size="md" className="mb-6" />
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <h2 className="text-2xl font-bold text-center text-soraki-primaryDark mb-4 px-4">
                        {studyingItem.title}
                    </h2>
                    {!showAnswer ? (
                        <p className="text-soraki-textLight text-center text-sm italic">
                           Como você explicaria este conceito?
                        </p>
                    ) : (
                        <div className="text-center animate-fade-in">
                            <p className="text-soraki-text font-medium mb-2">Avalie sua memória:</p>
                            <p className="text-xs text-soraki-textLight">A honestidade aqui é o segredo para o sucesso. 🌻</p>
                        </div>
                    )}
                </div>
                <div className="w-full mt-8">
                    {!showAnswer ? (
                        <button 
                            onClick={() => setShowAnswer(true)}
                            className="w-full bg-soraki-primary text-white py-4 rounded-2xl font-bold shadow-soft hover:scale-[1.02] transition-transform"
                        >
                            Mostrar Resposta e Avaliar
                        </button>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {difficultyButtons.map(btn => (
                                <button 
                                    key={btn.id}
                                    onClick={() => processResult(btn.id)}
                                    className={`flex flex-col items-center justify-center gap-1 p-3 rounded-2xl border transition-colors text-center ${btn.color}`}
                                >
                                    {btn.icon}
                                    <span className="text-xs font-bold whitespace-nowrap">{btn.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
