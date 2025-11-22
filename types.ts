
export interface Task {
  id: string;
  title: string;
  subject: string; // Added subject for categorization
  completed: boolean;
  date: string; // YYYY-MM-DD
}

export interface UserStats {
  streak: number;
  totalHours: number;
  sessions: number;
  lastStudyDate?: string; // To track streaks
}

export interface ReviewItem {
  id: string;
  title: string;
  subject: string;
  level: number;
  nextReview: string; // ISO Date string
  interval: number; // Current interval in days
}

export interface UserProfile {
  name: string;
  age: string;
  studyGoal: string; // e.g., "Passar em Medicina", "Aprender Inglês"
  avatar?: string; // Base64 string of the image
}