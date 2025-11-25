
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Task, ReviewItem, SubTask, Priority } from '../types';
import { 하루 } from '../utils/time';

interface DataContextProps {
  tasks: Task[];
  reviews: ReviewItem[];
  streak: number;
  addTask: (title: string, subject: string, priority: Priority) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addReview: (title: string) => void;
  deleteReview: (id: string) => void;
  updateReview: (id: string, newReview: ReviewItem) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('soraki-tasks');
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedReviews = localStorage.getItem('soraki-reviews');
      if (savedReviews) setReviews(JSON.parse(savedReviews));
      
      const stats = localStorage.getItem('soraki-stats');
      if (stats) {
        const { streak, lastCompletionDay } = JSON.parse(stats);
        if (하루.isYesterday(lastCompletionDay) || 하루.isToday(lastCompletionDay)) {
          setStreak(streak);
        } else {
          setStreak(0);
        }
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('soraki-tasks', JSON.stringify(tasks));
    checkCompletionForStreak();
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('soraki-reviews', JSON.stringify(reviews));
  }, [reviews]);

  const checkCompletionForStreak = () => {
    const todayStr = 하루.today();
    const completedToday = tasks.some(t => t.date === todayStr && t.completed);

    if (completedToday) {
      const stats = JSON.parse(localStorage.getItem('soraki-stats') || '{}');
      const lastCompletionDay = stats.lastCompletionDay;

      if (lastCompletionDay !== todayStr) {
        const newStreak = 하루.isYesterday(lastCompletionDay) ? (stats.streak || 0) + 1 : 1;
        setStreak(newStreak);
        localStorage.setItem('soraki-stats', JSON.stringify({ streak: newStreak, lastCompletionDay: todayStr }));
      }
    }
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

  const addReview = (title: string) => {
    const newReview: ReviewItem = {
      id: Date.now().toString(),
      title,
      subject: 'Geral',
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
        tasks, reviews, streak, 
        addTask, toggleTask, deleteTask, addSubtask, toggleSubtask,
        addReview, deleteReview, updateReview 
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
