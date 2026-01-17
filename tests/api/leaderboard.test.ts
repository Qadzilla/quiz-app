// API integration tests for leaderboard endpoints

import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/server/app.js';
import { clearAll, addQuiz, addPlayer, addAttempt } from '../../src/domain/store.js';
import type { Quiz, Player, QuizAttempt } from '../../src/domain/types.js';

const app = createApp();

describe('Leaderboard API', () => {
  beforeEach(() => {
    clearAll();
  });

  const seedData = () => {
    const quiz: Quiz = {
      id: 'quiz-1',
      title: 'Test Quiz',
      questions: [
        { id: 'q1', text: 'Q1?', options: ['A', 'B', 'C', 'D'], correctIndex: 0 },
        { id: 'q2', text: 'Q2?', options: ['A', 'B', 'C', 'D'], correctIndex: 1 },
      ],
    };
    addQuiz(quiz);

    const player1: Player = { id: 'p1', name: 'Alice' };
    const player2: Player = { id: 'p2', name: 'Bob' };
    const player3: Player = { id: 'p3', name: 'Charlie' };
    addPlayer(player1);
    addPlayer(player2);
    addPlayer(player3);

    const attempt1: QuizAttempt = {
      id: 'a1',
      playerId: 'p1',
      quizId: 'quiz-1',
      answers: [0, 1],
      score: 2,
      totalQuestions: 2,
      percentage: 100,
      completedAt: new Date('2024-01-01T10:00:00Z'),
    };
    const attempt2: QuizAttempt = {
      id: 'a2',
      playerId: 'p2',
      quizId: 'quiz-1',
      answers: [0, 0],
      score: 1,
      totalQuestions: 2,
      percentage: 50,
      completedAt: new Date('2024-01-01T11:00:00Z'),
    };
    const attempt3: QuizAttempt = {
      id: 'a3',
      playerId: 'p3',
      quizId: 'quiz-1',
      answers: [0, 1],
      score: 2,
      totalQuestions: 2,
      percentage: 100,
      completedAt: new Date('2024-01-01T12:00:00Z'),
    };
    addAttempt(attempt1);
    addAttempt(attempt2);
    addAttempt(attempt3);
  };

  describe('GET /api/leaderboard', () => {
    it('should return empty array when no attempts', async () => {
      const response = await request(app).get('/api/leaderboard');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return leaderboard with ranks', async () => {
      seedData();
      const response = await request(app).get('/api/leaderboard');
      expect(response.status).toBe(200);
      // TODO: Verify ranking order once buildLeaderboard is implemented
    });

    // TODO: Add tests for:
    // - Correct ranking order
    // - Tie handling
    // - Multiple attempts by same player (best score only)
  });

  describe('GET /api/leaderboard/top/:n', () => {
    it('should return top N players', async () => {
      seedData();
      const response = await request(app).get('/api/leaderboard/top/2');
      expect(response.status).toBe(200);
      expect(response.body.length).toBeLessThanOrEqual(2);
    });

    // TODO: Add more tests
  });

  describe('GET /api/leaderboard/player/:id', () => {
    it('should return 404 for non-existent player', async () => {
      const response = await request(app).get('/api/leaderboard/player/unknown');
      expect(response.status).toBe(404);
    });

    it('should return player stats', async () => {
      seedData();
      const response = await request(app).get('/api/leaderboard/player/p1');
      expect(response.status).toBe(200);
      expect(response.body.playerId).toBe('p1');
      expect(response.body.totalAttempts).toBeDefined();
    });

    // TODO: Add more tests
  });
});
