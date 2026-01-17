// In-memory data store for Quiz App

import type { Quiz, Player, QuizAttempt } from './types.js';

// In-memory storage
const quizzes = new Map<string, Quiz>();
const players = new Map<string, Player>();
const attempts = new Map<string, QuizAttempt>();

// Quiz operations
export function getQuiz(id: string): Quiz | undefined {
  // TODO: Implement
  return quizzes.get(id);
}

export function getAllQuizzes(): Quiz[] {
  // TODO: Implement
  return Array.from(quizzes.values());
}

export function addQuiz(quiz: Quiz): void {
  // TODO: Implement
  quizzes.set(quiz.id, quiz);
}

// Player operations
export function getPlayer(id: string): Player | undefined {
  // TODO: Implement
  return players.get(id);
}

export function getPlayerByName(name: string): Player | undefined {
  // TODO: Implement - find player by name
  return Array.from(players.values()).find(p => p.name === name);
}

export function addPlayer(player: Player): void {
  // TODO: Implement
  players.set(player.id, player);
}

// Attempt operations
export function getAttempt(id: string): QuizAttempt | undefined {
  // TODO: Implement
  return attempts.get(id);
}

export function getAttemptsByPlayer(playerId: string): QuizAttempt[] {
  // TODO: Implement - filter attempts by player
  return Array.from(attempts.values()).filter(a => a.playerId === playerId);
}

export function getAllAttempts(): QuizAttempt[] {
  // TODO: Implement
  return Array.from(attempts.values());
}

export function addAttempt(attempt: QuizAttempt): void {
  // TODO: Implement
  attempts.set(attempt.id, attempt);
}

// Utility
export function clearAll(): void {
  quizzes.clear();
  players.clear();
  attempts.clear();
}

// Seed default quiz data
export function seedDefaultQuiz(): void {
  const defaultQuiz: Quiz = {
    id: 'default',
    title: 'General Knowledge Quiz',
    questions: [
      {
        id: 'q1',
        text: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctIndex: 2,
      },
      {
        id: 'q2',
        text: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctIndex: 1,
      },
      {
        id: 'q3',
        text: 'What is the largest ocean on Earth?',
        options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
        correctIndex: 3,
      },
      {
        id: 'q4',
        text: 'How many continents are there?',
        options: ['5', '6', '7', '8'],
        correctIndex: 2,
      },
      {
        id: 'q5',
        text: 'What is the chemical symbol for gold?',
        options: ['Go', 'Gd', 'Au', 'Ag'],
        correctIndex: 2,
      },
      {
        id: 'q6',
        text: 'Who painted the Mona Lisa?',
        options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Michelangelo'],
        correctIndex: 2,
      },
      {
        id: 'q7',
        text: 'What is the largest mammal in the world?',
        options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
        correctIndex: 1,
      },
      {
        id: 'q8',
        text: 'In what year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correctIndex: 2,
      },
      {
        id: 'q9',
        text: 'What is the hardest natural substance on Earth?',
        options: ['Gold', 'Iron', 'Diamond', 'Platinum'],
        correctIndex: 2,
      },
      {
        id: 'q10',
        text: 'How many bones are in the adult human body?',
        options: ['186', '206', '226', '246'],
        correctIndex: 1,
      },
    ],
  };

  addQuiz(defaultQuiz);
}
