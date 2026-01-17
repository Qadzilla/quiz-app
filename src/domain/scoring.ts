// Scoring and ranking logic for Quiz App

import type { Quiz, QuizAttempt, LeaderboardEntry } from './types.js';
import { getAllAttempts, getPlayer } from './store.js';

/**
 * Calculate score from quiz answers
 * @param quiz - The quiz being taken
 * @param answers - Array of answer indices selected by player
 * @returns Number of correct answers
 */
export function calculateScore(quiz: Quiz, answers: number[]): number {
  let score = 0;
  for (let i = 0; i < quiz.questions.length; i++) {
    const question = quiz.questions[i];
    if (question && answers[i] === question.correctIndex) {
      score++;
    }
  }
  return score;
}

/**
 * Calculate percentage score
 * @param score - Number of correct answers
 * @param total - Total number of questions
 * @returns Percentage as a number (0-100)
 */
export function calculatePercentage(score: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((score / total) * 10000) / 100;
}

/**
 * Build leaderboard from all attempts
 * Takes best attempt per player, ranks by score, handles ties
 * @returns Sorted array of leaderboard entries
 */
export function buildLeaderboard(): LeaderboardEntry[] {
  const attempts = getAllAttempts();

  if (attempts.length === 0) {
    return [];
  }

  // Group by player, keep only best attempt per player
  const bestByPlayer = new Map<string, QuizAttempt>();
  for (const attempt of attempts) {
    const existing = bestByPlayer.get(attempt.playerId);
    if (!existing || compareAttempts(attempt, existing) < 0) {
      bestByPlayer.set(attempt.playerId, attempt);
    }
  }

  // Sort best attempts by score (desc), percentage (desc), then date (asc)
  const sorted = [...bestByPlayer.values()].sort(compareAttempts);

  // Convert to leaderboard entries (ranks assigned later)
  const entries: LeaderboardEntry[] = sorted.map((attempt) => {
    const player = getPlayer(attempt.playerId);
    return {
      rank: 0, // Will be assigned by assignRanks
      playerId: attempt.playerId,
      playerName: player?.name ?? 'Unknown',
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: attempt.percentage,
      completedAt: attempt.completedAt,
    };
  });

  // Assign ranks with tie handling
  assignRanks(entries);

  return entries;
}

/**
 * Compare two attempts for ranking (used in sorting)
 * @returns negative if a ranks higher, positive if b ranks higher, 0 if tied
 */
export function compareAttempts(a: QuizAttempt, b: QuizAttempt): number {
  if (b.score !== a.score) {
    return b.score - a.score;
  }
  if (b.percentage !== a.percentage) {
    return b.percentage - a.percentage;
  }
  return a.completedAt.getTime() - b.completedAt.getTime();
}

/**
 * Assign ranks to sorted entries, handling ties
 * Players with same score/percentage get same rank
 */
export function assignRanks(entries: LeaderboardEntry[]): void {
  if (entries.length === 0) return;

  let currentRank = 1;
  entries[0]!.rank = currentRank;

  for (let i = 1; i < entries.length; i++) {
    const current = entries[i]!;
    const previous = entries[i - 1]!;

    // Same score and percentage = same rank (tie)
    if (current.score === previous.score && current.percentage === previous.percentage) {
      current.rank = previous.rank;
    } else {
      // Different score/percentage = position-based rank (skips tied positions)
      current.rank = i + 1;
    }
  }
}
