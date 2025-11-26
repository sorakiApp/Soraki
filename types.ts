
export type Priority = 'leve' | 'medio' | 'profundo';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}
export interface Task {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
  priority: Priority;
  subtasks: SubTask[];
}

export interface UserStats {
  streak: number;
  totalHours: number;
  sessions: number;
  lastStudyDate?: string; // To track streaks
}

export type ReviewDifficulty = 'muito-dificil' | 'dificil' | 'facil' | 'muito-facil';

export interface ReviewItem {
  id: string;
  front: string; // Pergunta
  back: string;  // Resposta
  subject: string;
  // SRS Data
  level: number;
  interval: number; // Current interval in days
  easeFactor: number; // Similar to Anki's ease factor
  nextReview: string; // ISO Date string
}

export interface UserProfile {
  name: string;
  age: string;
  studyGoal: string; // e.g., "Passar em Medicina", "Aprender Inglês"
  avatar?: string; // Base64 string of the image
}
