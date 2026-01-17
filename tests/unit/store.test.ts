// Unit tests for data store

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getQuiz,
  addQuiz,
  getAllQuizzes,
  getPlayer,
  addPlayer,
  getPlayerByName,
  getAttempt,
  addAttempt,
  getAllAttempts,
  getAttemptsByPlayer,
  clearAll,
} from '../../src/domain/store.js';
import type { Quiz, Player, QuizAttempt } from '../../src/domain/types.js';

describe('Quiz Store', () => {
  beforeEach(() => {
    clearAll();
  });

  describe('quizzes', () => {
    const mockQuiz: Quiz = {
      id: 'quiz-1',
      title: 'Test Quiz',
      questions: [],
    };

    it('should add and retrieve a quiz', () => {
      addQuiz(mockQuiz);
      expect(getQuiz('quiz-1')).toEqual(mockQuiz);
    });

    it('should return undefined for non-existent quiz', () => {
      expect(getQuiz('non-existent')).toBeUndefined();
    });

    it('should return all quizzes', () => {
      addQuiz(mockQuiz);
      addQuiz({ ...mockQuiz, id: 'quiz-2', title: 'Quiz 2' });
      expect(getAllQuizzes()).toHaveLength(2);
    });

    // TODO: Add more tests
  });

  describe('players', () => {
    const mockPlayer: Player = {
      id: 'player-1',
      name: 'Test Player',
    };

    it('should add and retrieve a player', () => {
      addPlayer(mockPlayer);
      expect(getPlayer('player-1')).toEqual(mockPlayer);
    });

    it('should find player by name', () => {
      addPlayer(mockPlayer);
      expect(getPlayerByName('Test Player')).toEqual(mockPlayer);
    });

    it('should return undefined for non-existent player name', () => {
      expect(getPlayerByName('Unknown')).toBeUndefined();
    });

    // TODO: Add more tests
  });

  describe('attempts', () => {
    const mockAttempt: QuizAttempt = {
      id: 'attempt-1',
      playerId: 'player-1',
      quizId: 'quiz-1',
      answers: [0, 1, 2],
      score: 3,
      totalQuestions: 3,
      percentage: 100,
      completedAt: new Date(),
    };

    it('should add and retrieve an attempt', () => {
      addAttempt(mockAttempt);
      expect(getAttempt('attempt-1')).toEqual(mockAttempt);
    });

    it('should get attempts by player', () => {
      addAttempt(mockAttempt);
      addAttempt({ ...mockAttempt, id: 'attempt-2' });
      addAttempt({ ...mockAttempt, id: 'attempt-3', playerId: 'player-2' });

      const playerAttempts = getAttemptsByPlayer('player-1');
      expect(playerAttempts).toHaveLength(2);
    });

    it('should get all attempts', () => {
      addAttempt(mockAttempt);
      addAttempt({ ...mockAttempt, id: 'attempt-2' });
      expect(getAllAttempts()).toHaveLength(2);
    });

    // TODO: Add more tests
  });
});
