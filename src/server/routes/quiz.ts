// Quiz API routes

import { Router } from 'express';
import type { Quiz, QuizAttempt } from '../../domain/types.js';
import { getQuiz, getAllQuizzes, addAttempt, addPlayer, getPlayerByName } from '../../domain/store.js';
import { calculateScore, calculatePercentage } from '../../domain/scoring.js';

export const quizRouter = Router();

// GET /api/quiz - Get all available quizzes
quizRouter.get('/', (_req, res) => {
  const quizzes = getAllQuizzes();
  res.json(quizzes);
});

// GET /api/quiz/:id - Get a specific quiz
quizRouter.get('/:id', (req, res) => {
  const quiz = getQuiz(req.params['id'] ?? '');
  if (!quiz) {
    res.status(404).json({ error: 'Quiz not found' });
    return;
  }

  // Remove correct answers from response
  const safeQuiz = {
    ...quiz,
    questions: quiz.questions.map(q => ({
      id: q.id,
      text: q.text,
      options: q.options,
    })),
  };

  res.json(safeQuiz);
});

// POST /api/quiz/:id/submit - Submit quiz answers
quizRouter.post('/:id/submit', (req, res) => {
  const quizId = req.params['id'] ?? '';
  const { playerName, answers } = req.body as { playerName: string; answers: number[] };

  // Validate
  if (!playerName || !answers) {
    res.status(400).json({ error: 'Missing playerName or answers' });
    return;
  }

  const quiz = getQuiz(quizId);
  if (!quiz) {
    res.status(404).json({ error: 'Quiz not found' });
    return;
  }

  // Get or create player
  let player = getPlayerByName(playerName);
  if (!player) {
    player = {
      id: crypto.randomUUID(),
      name: playerName,
    };
    addPlayer(player);
  }

  // Calculate score
  const score = calculateScore(quiz, answers);
  const percentage = calculatePercentage(score, quiz.questions.length);

  // Create attempt
  const attempt: QuizAttempt = {
    id: crypto.randomUUID(),
    playerId: player.id,
    quizId: quiz.id,
    answers,
    score,
    totalQuestions: quiz.questions.length,
    percentage,
    completedAt: new Date(),
  };

  addAttempt(attempt);

  // Return results with correct answers for review
  res.json({
    score,
    totalQuestions: quiz.questions.length,
    percentage,
    correctAnswers: quiz.questions.map(q => q.correctIndex),
  });
});
