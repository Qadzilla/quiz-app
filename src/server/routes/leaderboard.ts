// Leaderboard API routes

import { Router } from 'express';
import { buildLeaderboard } from '../../domain/scoring.js';
import { getAttemptsByPlayer, getPlayer } from '../../domain/store.js';

export const leaderboardRouter = Router();

// GET /api/leaderboard - Get global leaderboard
leaderboardRouter.get('/', (_req, res) => {
  // TODO: Implement
  // - Build leaderboard with ranks
  // - Optionally support ?limit=N query param
  const leaderboard = buildLeaderboard();
  res.json(leaderboard);
});

// GET /api/leaderboard/top/:n - Get top N players
leaderboardRouter.get('/top/:n', (req, res) => {
  // TODO: Implement
  const n = parseInt(req.params['n'] ?? '10', 10);
  const leaderboard = buildLeaderboard();
  res.json(leaderboard.slice(0, n));
});

// GET /api/leaderboard/player/:id - Get specific player's rank and stats
leaderboardRouter.get('/player/:id', (req, res) => {
  // TODO: Implement
  // - Find player's position in leaderboard
  // - Return their rank and stats
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

// TODO: Add routes for:
// - GET /api/leaderboard/stats - Overall statistics
// - GET /api/leaderboard/around/:playerId - Get players around a specific player
