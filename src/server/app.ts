// Express app configuration

import express from 'express';
import cors from 'cors';
import { quizRouter } from './routes/quiz.js';
import { leaderboardRouter } from './routes/leaderboard.js';

export function createApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // API routes
  app.use('/api/quiz', quizRouter);
  app.use('/api/leaderboard', leaderboardRouter);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}
