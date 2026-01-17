// Leaderboard API routes

import { Router } from 'express';
import { buildLeaderboard } from '../../domain/scoring.js';
import { getAttemptsByPlayer, getPlayer } from '../../domain/store.js';

export const leaderboardRouter = Router();

// GET /api/leaderboard - Get global leaderboard
leaderboardRouter.get('/', (_req, res) => {
  const leaderboard = buildLeaderboard();
  res.json(leaderboard);
});

// GET /api/leaderboard/top/:n - Get top N players
leaderboardRouter.get('/top/:n', (req, res) => {
  const n = parseInt(req.params['n'] ?? '10', 10);
  const leaderboard = buildLeaderboard();
  res.json(leaderboard.slice(0, n));
});

// GET /api/leaderboard/player/:id - Get specific player's rank and stats
leaderboardRouter.get('/player/:id', (req, res) => {
  const playerId = req.params['id'] ?? '';
  const player = getPlayer(playerId);

  if (!player) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }

  const leaderboard = buildLeaderboard();
  const entry = leaderboard.find(e => e.playerId === playerId);

  if (!entry) {
    res.status(404).json({ error: 'Player has no attempts' });
    return;
  }

  const attempts = getAttemptsByPlayer(playerId);

  res.json({
    ...entry,
    totalAttempts: attempts.length,
  });
});
