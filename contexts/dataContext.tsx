
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Task, ReviewItem, SubTask, Priority, UserProfile } from '../types';
import { 하루 } from '../utils/time';

interface DataContextProps {
  tasks: Task[];
  reviews: ReviewItem[];
  streak: number;
  totalHours: number;
  sessions: number;
  userProfile: UserProfile | null;
  addTask: (title: string, subject: string, priority: Priority) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addReview: (front: string, back: string, subject: string) => void;
  deleteReview: (id: string) => void;
  updateReview: (id: string, newReview: ReviewItem) => void;
  addFocusSession: (durationInMinutes: number) => void;
  updateUserProfile: (profile: UserProfile | Partial<UserProfile>) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Load data from localStorage on initial mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('soraki-tasks');
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedReviews = localStorage.getItem('soraki-reviews');
      if (savedReviews) setReviews(JSON.parse(savedReviews));
      
      const savedProfile = localStorage.getItem('soraki-profile');
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));

      const stats = localStorage.getItem('soraki-stats');
      if (stats) {
        const parsedStats = JSON.parse(stats);
        if (하루.isYesterday(parsedStats.lastCompletionDay) || 하루.isToday(parsedStats.lastCompletionDay)) {
          setStreak(parsedStats.streak || 0);
        } else {
          setStreak(0); // Reset streak if a day was missed
        }
        setTotalHours(parsedStats.totalHours || 0);
        setSessions(parsedStats.sessions || 0);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  // --- TASKS --- 
  useEffect(() => {
    localStorage.setItem('soraki-tasks', JSON.stringify(tasks));
    checkCompletionForStreak();
  }, [tasks]);

  // --- REVIEWS --- 
  useEffect(() => {
    localStorage.setItem('soraki-reviews', JSON.stringify(reviews));
  }, [reviews]);

  // --- USER PROFILE --- 
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('soraki-profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const updateUserProfile = (profile: UserProfile | Partial<UserProfile>) => {
      setUserProfile(prevProfile => ({ ...prevProfile!, ...profile }));
  };

  const checkCompletionForStreak = () => {
    const todayStr = 하루.today();
    const completedToday = tasks.some(t => t.date === todayStr && t.completed);

    if (completedToday) {
      const stats = JSON.parse(localStorage.getItem('soraki-stats') || '{}');
      const lastCompletionDay = stats.lastCompletionDay;

      if (lastCompletionDay !== todayStr) {
        const newStreak = 하루.isYesterday(lastCompletionDay) ? (stats.streak || 0) + 1 : 1;
        setStreak(newStreak);
        localStorage.setItem('soraki-stats', JSON.stringify({ ...stats, streak: newStreak, lastCompletionDay: todayStr }));
      }
    }
  };

  const addFocusSession = (durationInMinutes: number) => {
    const newTotalHours = totalHours + durationInMinutes / 60;
    const newSessions = sessions + 1;
    setTotalHours(newTotalHours);
    setSessions(newSessions);

    const stats = JSON.parse(localStorage.getItem('soraki-stats') || '{}');
    localStorage.setItem('soraki-stats', JSON.stringify({
        ...stats,
        totalHours: newTotalHours,
        sessions: newSessions,
        lastStudyDate: 하루.today()
    }));
  };

  const addTask = (title: string, subject: string, priority: Priority) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      subject,
      completed: false,
      date: 하루.today(),
      priority,
      subtasks: [],
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addSubtask = (taskId: string, title: string) => {
    if (!title.trim()) return;
    const newSubtask: SubTask = {
      id: Date.now().toString(),
      title,
      completed: false
    };
    setTasks(tasks.map(t => t.id === taskId ? { ...t, subtasks: [...t.subtasks, newSubtask] } : t));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.map(sub =>
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          )
        };
      }
      return task;
    }));
  };

  const addReview = (front: string, back: string, subject: string) => {
    const newReview: ReviewItem = {
      id: Date.now().toString(),
      front,
      back,
      subject: subject || 'Geral',
      level: 0,
      interval: 0,
      easeFactor: 2.5,
      nextReview: new Date().toISOString(),
    };
    setReviews(prevReviews => [...prevReviews, newReview]);
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  const updateReview = (id: string, updatedReview: ReviewItem) => {
    setReviews(reviews.map(r => r.id === id ? updatedReview : r));
  };

  return (
    <DataContext.Provider value={{ 
        tasks, reviews, streak, totalHours, sessions, userProfile,
        addTask, toggleTask, deleteTask, addSubtask, toggleSubtask,
        addReview, deleteReview, updateReview, addFocusSession, updateUserProfile
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
