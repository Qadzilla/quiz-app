// Domain types for Quiz App

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface QuizAttempt {
  id: string;
  playerId: string;
  quizId: string;
  answers: number[]; // Index of selected answer for each question
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: Date;
}

export interface Player {
  id: string;
  name: string;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: Date;
}
