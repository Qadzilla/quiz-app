// API integration tests for quiz endpoints

import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/server/app.js';
import { clearAll, addQuiz } from '../../src/domain/store.js';
import type { Quiz } from '../../src/domain/types.js';

const app = createApp();

describe('Quiz API', () => {
  beforeEach(() => {
    clearAll();
  });

  const seedQuiz: Quiz = {
    id: 'default',
    title: 'Premier League Quiz',
    questions: [
      {
        id: 'q1',
        text: 'Which team has won the most Premier League titles?',
        options: ['Liverpool', 'Manchester United', 'Chelsea', 'Arsenal'],
        correctIndex: 1,
      },
      {
        id: 'q2',
        text: 'Who is the Premier League all-time top scorer?',
        options: ['Wayne Rooney', 'Alan Shearer', 'Thierry Henry', 'Sergio Aguero'],
        correctIndex: 1,
      },
    ],
  };

  describe('GET /api/quiz', () => {
    it('should return empty array when no quizzes', async () => {
      const response = await request(app).get('/api/quiz');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all quizzes', async () => {
      addQuiz(seedQuiz);
      const response = await request(app).get('/api/quiz');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    // TODO: Add more tests
  });

  describe('GET /api/quiz/:id', () => {
    it('should return 404 for non-existent quiz', async () => {
      const response = await request(app).get('/api/quiz/non-existent');
      expect(response.status).toBe(404);
    });

    it('should return quiz without correct answers', async () => {
      addQuiz(seedQuiz);
      const response = await request(app).get('/api/quiz/default');
      expect(response.status).toBe(200);
      expect(response.body.id).toBe('default');
      // Verify correct answers are stripped
      expect(response.body.questions[0]).not.toHaveProperty('correctIndex');
    });

    // TODO: Add more tests
  });

  describe('POST /api/quiz/:id/submit', () => {
    beforeEach(() => {
      addQuiz(seedQuiz);
    });

    it('should return 400 for missing playerName', async () => {
      const response = await request(app)
        .post('/api/quiz/default/submit')
        .send({ answers: [0, 1] });
      expect(response.status).toBe(400);
    });

    it('should return 400 for missing answers', async () => {
      const response = await request(app)
        .post('/api/quiz/default/submit')
        .send({ playerName: 'Test Player' });
      expect(response.status).toBe(400);
    });

    it('should return 404 for non-existent quiz', async () => {
      const response = await request(app)
        .post('/api/quiz/non-existent/submit')
        .send({ playerName: 'Test Player', answers: [0, 1] });
      expect(response.status).toBe(404);
    });

    it('should submit quiz and return score', async () => {
      const response = await request(app)
        .post('/api/quiz/default/submit')
        .send({ playerName: 'Test Player', answers: [1, 1] }); // Both correct

      expect(response.status).toBe(200);
      expect(response.body.score).toBe(2);
      expect(response.body.totalQuestions).toBe(2);
      expect(response.body.percentage).toBe(100);
      expect(response.body.correctAnswers).toEqual([1, 1]);
    });

    it('should calculate partial score correctly', async () => {
      const response = await request(app)
        .post('/api/quiz/default/submit')
        .send({ playerName: 'Test Player', answers: [1, 0] }); // First correct, second wrong

      expect(response.status).toBe(200);
      expect(response.body.score).toBe(1);
      expect(response.body.percentage).toBe(50);
    });

    // TODO: Add tests for:
    // - Creating new player
    // - Reusing existing player
    // - Multiple submissions by same player
  });

  describe('GET /api/health', () => {
    it('should return ok status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
