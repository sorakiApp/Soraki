
import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { Task, ReviewItem, SubTask, Priority, UserProfile, UserStats } from '../types';
import { 하루 } from '../utils/time';

// --- TYPES & INTERFACES ---
interface DataContextProps {
  tasks: Task[];
  reviews: ReviewItem[];
  stats: UserStats;
  userProfile: UserProfile | null;
  isLoading: boolean;
  addTask: (title: string, subject: string, priority: Priority) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addReview: (front: string, back: string, subject: string) => void;
  deleteReview: (id: string) => void;
  updateReview: (id: string, newReview: ReviewItem) => void;
  addFocusSession: (durationInMinutes: number) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

// --- INITIAL STATE & DEFAULTS ---
const DataContext = createContext<DataContextProps | undefined>(undefined);

const defaultStats: UserStats = {
    streak: 0,
    totalHours: 0,
    sessions: 0,
    lastCompletionDay: null
};

// --- DATA PROVIDER COMPONENT ---
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true); // Trava de segurança

  // --- DATA LOADING EFFECT (ON MOUNT) ---
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('soraki-tasks');
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedReviews = localStorage.getItem('soraki-reviews');
      if (savedReviews) setReviews(JSON.parse(savedReviews));
      
      const savedProfile = localStorage.getItem('soraki-profile');
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));

      const savedStats = localStorage.getItem('soraki-stats');
      if (savedStats) {
        const parsedStats: UserStats = JSON.parse(savedStats);
        if (parsedStats.lastCompletionDay && !하루.isYesterday(parsedStats.lastCompletionDay) && !하루.isToday(parsedStats.lastCompletionDay)) {
          parsedStats.streak = 0;
        }
        setStats(parsedStats);
      }
    } catch (error) {
      console.error("Falha ao carregar os dados do localStorage", error);
      // Garante que o estado comece limpo em caso de erro de parsing
      setTasks([]);
      setReviews([]);
      setUserProfile(null);
      setStats(defaultStats);
    } finally {
      // Desbloqueia o salvamento APÓS o carregamento ter sido concluído
      setIsLoading(false);
    }
  }, []);

  // --- DATA PERSISTENCE EFFECTS ---
  useEffect(() => {
    if (isLoading) return; // Trava de segurança ativada
    localStorage.setItem('soraki-tasks', JSON.stringify(tasks));
    
    const completedToday = tasks.some(t => t.date === 하루.today() && t.completed);
    setStats(prevStats => {
        const todayStr = 하루.today();
        if (completedToday && prevStats.lastCompletionDay !== todayStr) {
            const newStreak = (prevStats.lastCompletionDay && 하루.isYesterday(prevStats.lastCompletionDay)) 
                                ? prevStats.streak + 1 
                                : 1;
            return { ...prevStats, streak: newStreak, lastCompletionDay: todayStr };
        }
        return prevStats; // Retorna o estado anterior se nenhuma mudança for necessária
    });
  }, [tasks, isLoading]);

  useEffect(() => {
    if (isLoading) return; // Trava de segurança ativada
    localStorage.setItem('soraki-reviews', JSON.stringify(reviews));
  }, [reviews, isLoading]);

  useEffect(() => {
    if (isLoading) return; // Trava de segurança ativada
    if (userProfile) {
      localStorage.setItem('soraki-profile', JSON.stringify(userProfile));
    }
  }, [userProfile, isLoading]);

  useEffect(() => {
    if (isLoading) return; // Trava de segurança ativada
    localStorage.setItem('soraki-stats', JSON.stringify(stats));
  }, [stats, isLoading]);

  // --- ACTION FUNCTIONS (Otimizadas com atualizações funcionais) ---

  const updateUserProfile = (profileUpdate: Partial<UserProfile>) => {
      setUserProfile(prev => ({ ...prev!, ...profileUpdate }));
  };

  const addFocusSession = (durationInMinutes: number) => {
    setStats(prev => ({
        ...prev,
        totalHours: prev.totalHours + durationInMinutes / 60,
        sessions: prev.sessions + 1
    }));
  };

  const addTask = (title: string, subject: string, priority: Priority) => {
    const newTask: Task = {
      id: Date.now().toString(), title, subject, priority,
      completed: false, date: 하루.today(), subtasks: [],
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addSubtask = (taskId: string, title: string) => {
    if (!title.trim()) return;
    const newSubtask: SubTask = { id: Date.now().toString(), title, completed: false };
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, subtasks: [...t.subtasks, newSubtask] } : t));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, subtasks: task.subtasks.map(sub => 
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub) }
        : task
    ));
  };

  const addReview = (front: string, back: string, subject: string) => {
    const newReview: ReviewItem = {
      id: Date.now().toString(), front, back, subject: subject || 'Geral',
      level: 0, interval: 0, easeFactor: 2.5, nextReview: new Date().toISOString(),
    };
    setReviews(prev => [...prev, newReview]);
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const updateReview = (id: string, updatedReview: ReviewItem) => {
    setReviews(prev => prev.map(r => r.id === id ? updatedReview : r));
  };

  return (
    <DataContext.Provider value={{ 
        tasks, reviews, stats, userProfile, isLoading,
        addTask, toggleTask, deleteTask, addSubtask, toggleSubtask,
        addReview, deleteReview, updateReview, addFocusSession, updateUserProfile
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};
