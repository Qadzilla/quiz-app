// Unit tests for scoring logic

import { describe, it, expect, beforeEach } from 'vitest';
import { calculateScore, calculatePercentage, compareAttempts } from '../../src/domain/scoring.js';
import type { Quiz, QuizAttempt } from '../../src/domain/types.js';

describe('calculateScore', () => {
  const mockQuiz: Quiz = {
    id: 'test-quiz',
    title: 'Test Quiz',
    questions: [
      { id: 'q1', text: 'Question 1?', options: ['A', 'B', 'C', 'D'], correctIndex: 0 },
      { id: 'q2', text: 'Question 2?', options: ['A', 'B', 'C', 'D'], correctIndex: 1 },
      { id: 'q3', text: 'Question 3?', options: ['A', 'B', 'C', 'D'], correctIndex: 2 },
    ],
  };

  it('should return 0 for all wrong answers', () => {
    const answers = [1, 2, 3]; // All wrong
    expect(calculateScore(mockQuiz, answers)).toBe(0);
  });

  it('should return full score for all correct answers', () => {
    const answers = [0, 1, 2]; // All correct
    expect(calculateScore(mockQuiz, answers)).toBe(3);
  });

  it('should return partial score for some correct answers', () => {
    const answers = [0, 2, 2]; // First and third correct
    expect(calculateScore(mockQuiz, answers)).toBe(2);
  });
});

describe('calculatePercentage', () => {
  it('should return 0 for zero total', () => {
    expect(calculatePercentage(5, 0)).toBe(0);
  });

  it('should return 100 for perfect score', () => {
    expect(calculatePercentage(10, 10)).toBe(100);
  });

  it('should return 50 for half correct', () => {
    expect(calculatePercentage(5, 10)).toBe(50);
  });

  it('should round to 2 decimal places', () => {
    expect(calculatePercentage(1, 3)).toBe(33.33);
  });
});

describe('compareAttempts', () => {
  const baseAttempt: QuizAttempt = {
    id: 'a1',
    playerId: 'p1',
    quizId: 'q1',
    answers: [],
    score: 5,
    totalQuestions: 10,
    percentage: 50,
    completedAt: new Date('2024-01-01T12:00:00Z'),
  };

  it('should rank higher score first', () => {
    const higher = { ...baseAttempt, score: 8 };
    const lower = { ...baseAttempt, score: 5 };
    expect(compareAttempts(higher, lower)).toBeLessThan(0);
  });

  it('should rank higher percentage first when scores equal', () => {
    const higher = { ...baseAttempt, percentage: 80 };
    const lower = { ...baseAttempt, percentage: 50 };
    expect(compareAttempts(higher, lower)).toBeLessThan(0);
  });

  it('should rank earlier completion first when score and percentage equal', () => {
    const earlier = { ...baseAttempt, completedAt: new Date('2024-01-01T10:00:00Z') };
    const later = { ...baseAttempt, completedAt: new Date('2024-01-01T14:00:00Z') };
    expect(compareAttempts(earlier, later)).toBeLessThan(0);
  });
});
