// Quiz App Frontend

// API base URL
const API_BASE = '/api';

// State
let currentQuiz: Quiz | null = null;
let currentQuestionIndex = 0;
let playerName = '';
let answers: number[] = [];
let score = 0;
let correctAnswers: number[] = [];

// Types (client-side, without correct answers)
interface Question {
  id: string;
  text: string;
  options: string[];
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
}

interface SubmitResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  correctAnswers: number[];
}

// DOM Elements
// TODO: Add type assertions after ensuring elements exist
const quizTab = document.getElementById('quiz-tab');
const leaderboardTab = document.getElementById('leaderboard-tab');
const quizSection = document.getElementById('quiz-section');
const leaderboardSection = document.getElementById('leaderboard-section');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startForm = document.getElementById('start-form');
const playerNameInput = document.getElementById('player-name') as HTMLInputElement;
const questionCount = document.getElementById('question-count');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const resultName = document.getElementById('result-name');
const finalScore = document.getElementById('final-score');
const totalQuestions = document.getElementById('total-questions');
const percentage = document.getElementById('percentage');
const playAgainBtn = document.getElementById('play-again');
const viewLeaderboardBtn = document.getElementById('view-leaderboard');
const leaderboardList = document.getElementById('leaderboard-list');
const answerReview = document.getElementById('answer-review');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.getElementById('loading-text');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const errorDismiss = document.getElementById('error-dismiss');
const startButton = document.querySelector('#start-form button') as HTMLButtonElement | null;

// Loading and Error Helpers
function showLoading(text = 'Loading...'): void {
  if (loadingText) loadingText.textContent = text;
  loadingOverlay?.classList.remove('hidden');
}

function hideLoading(): void {
  loadingOverlay?.classList.add('hidden');
}

function showError(message: string): void {
  if (errorText) errorText.textContent = message;
  errorMessage?.classList.remove('hidden');
}

function hideError(): void {
  errorMessage?.classList.add('hidden');
}

// API Functions
async function fetchQuiz(id: string): Promise<Quiz> {
  // TODO: Implement API call
  const response = await fetch(`${API_BASE}/quiz/${id}`);
  if (!response.ok) throw new Error('Failed to fetch quiz');
  return response.json() as Promise<Quiz>;
}

async function submitQuiz(quizId: string, playerName: string, answers: number[]): Promise<SubmitResult> {
  // TODO: Implement API call
  const response = await fetch(`${API_BASE}/quiz/${quizId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName, answers }),
  });
  if (!response.ok) throw new Error('Failed to submit quiz');
  return response.json() as Promise<SubmitResult>;
}

async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  // TODO: Implement API call
  const response = await fetch(`${API_BASE}/leaderboard`);
  if (!response.ok) throw new Error('Failed to fetch leaderboard');
  return response.json() as Promise<LeaderboardEntry[]>;
}

// UI Functions
function showScreen(screen: 'start' | 'quiz' | 'results'): void {
  // TODO: Implement screen switching
  startScreen?.classList.add('hidden');
  quizScreen?.classList.add('hidden');
  resultsScreen?.classList.add('hidden');

  switch (screen) {
    case 'start':
      startScreen?.classList.remove('hidden');
      break;
    case 'quiz':
      quizScreen?.classList.remove('hidden');
      break;
    case 'results':
      resultsScreen?.classList.remove('hidden');
      break;
  }
}

function showSection(section: 'quiz' | 'leaderboard'): void {
  // TODO: Implement tab switching
  quizSection?.classList.add('hidden');
  leaderboardSection?.classList.add('hidden');
  quizTab?.classList.remove('active');
  leaderboardTab?.classList.remove('active');

  if (section === 'quiz') {
    quizSection?.classList.remove('hidden');
    quizTab?.classList.add('active');
  } else {
    leaderboardSection?.classList.remove('hidden');
    leaderboardTab?.classList.add('active');
    loadLeaderboard();
  }
}

function renderQuestion(): void {
  // TODO: Implement question rendering
  if (!currentQuiz) return;

  const question = currentQuiz.questions[currentQuestionIndex];
  if (!question) return;

  if (questionCount) {
    questionCount.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`;
  }
  if (questionText) {
    questionText.textContent = question.text;
  }

  if (optionsContainer) {
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'option-btn';
      button.textContent = option;
      button.addEventListener('click', () => selectAnswer(index));
      optionsContainer.appendChild(button);
    });
  }

  feedback?.classList.add('hidden');
  nextBtn?.classList.add('hidden');
}

function selectAnswer(index: number): void {
  answers[currentQuestionIndex] = index;

  // Update selection styling (allow changing answer)
  const buttons = optionsContainer?.querySelectorAll('.option-btn');
  buttons?.forEach((btn, i) => {
    btn.classList.remove('selected');
    if (i === index) {
      btn.classList.add('selected');
    }
  });

  // Show next button
  nextBtn?.classList.remove('hidden');
}

function nextQuestion(): void {
  // TODO: Implement next question logic
  currentQuestionIndex++;
  if (currentQuiz && currentQuestionIndex >= currentQuiz.questions.length) {
    finishQuiz();
  } else {
    renderQuestion();
  }
}

async function finishQuiz(): Promise<void> {
  if (!currentQuiz) return;

  showLoading('Submitting quiz...');

  try {
    const result = await submitQuiz(currentQuiz.id, playerName, answers);

    hideLoading();

    if (resultName) resultName.textContent = playerName;
    if (finalScore) finalScore.textContent = String(result.score);
    if (totalQuestions) totalQuestions.textContent = String(result.totalQuestions);
    if (percentage) percentage.textContent = `${result.percentage}%`;

    score = result.score;
    correctAnswers = result.correctAnswers;

    renderAnswerReview();
    showScreen('results');
  } catch (error) {
    console.error('Failed to submit quiz:', error);
    hideLoading();
    showError('Failed to submit quiz. Please try again.');
  }
}

function renderAnswerReview(): void {
  if (!answerReview || !currentQuiz) return;

  const reviewHtml = currentQuiz.questions.map((question, index) => {
    const userAnswer = answers[index];
    const correctAnswer = correctAnswers[index];
    const isCorrect = userAnswer === correctAnswer;

    const userAnswerText = userAnswer !== undefined ? question.options[userAnswer] : 'No answer';
    const correctAnswerText = correctAnswer !== undefined ? question.options[correctAnswer] : 'Unknown';

    return `
      <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
        <div class="review-question">${index + 1}. ${question.text}</div>
        ${isCorrect
          ? `<div class="review-answer correct-answer">Your answer: ${userAnswerText}</div>`
          : `<div class="review-answer your-answer">Your answer: ${userAnswerText}</div>
             <div class="review-answer correct-answer">Correct answer: ${correctAnswerText}</div>`
        }
      </div>
    `;
  }).join('');

  answerReview.innerHTML = `<h3>Answer Review</h3>${reviewHtml}`;
}

async function loadLeaderboard(): Promise<void> {
  showLoading('Loading leaderboard...');

  try {
    const entries = await fetchLeaderboard();

    hideLoading();

    if (leaderboardList) {
      if (entries.length === 0) {
        leaderboardList.innerHTML = '<p class="empty-state">No scores yet. Be the first to play!</p>';
        return;
      }

      leaderboardList.innerHTML = entries
        .map(
          entry => `
          <div class="leaderboard-row">
            <span class="rank">#${entry.rank}</span>
            <span class="player-name">${entry.playerName}</span>
            <span>${entry.score}/${entry.totalQuestions}</span>
            <span>${entry.percentage}%</span>
          </div>
        `
        )
        .join('');
    }
  } catch (error) {
    console.error('Failed to load leaderboard:', error);
    hideLoading();
    if (leaderboardList) {
      leaderboardList.innerHTML = '<p class="empty-state">Failed to load leaderboard</p>';
    }
  }
}

async function startQuiz(): Promise<void> {
  currentQuestionIndex = 0;
  answers = [];
  score = 0;

  if (startButton) startButton.disabled = true;
  showLoading('Loading quiz...');

  try {
    currentQuiz = await fetchQuiz('default');
    hideLoading();
    if (startButton) startButton.disabled = false;
    showScreen('quiz');
    renderQuestion();
  } catch (error) {
    console.error('Failed to start quiz:', error);
    hideLoading();
    showError('Failed to load quiz. Please try again.');
  }
}

function resetQuiz(): void {
  currentQuiz = null;
  currentQuestionIndex = 0;
  answers = [];
  score = 0;
  correctAnswers = [];
  showScreen('start');
}

// Event Listeners
function initEventListeners(): void {
  // Tab switching
  quizTab?.addEventListener('click', () => showSection('quiz'));
  leaderboardTab?.addEventListener('click', () => showSection('leaderboard'));

  // Start quiz
  startForm?.addEventListener('submit', e => {
    e.preventDefault();
    playerName = playerNameInput?.value.trim() ?? '';
    if (playerName) {
      startQuiz();
    }
  });

  // Next question
  nextBtn?.addEventListener('click', nextQuestion);

  // Play again
  playAgainBtn?.addEventListener('click', resetQuiz);

  // View leaderboard from results
  viewLeaderboardBtn?.addEventListener('click', () => {
    showSection('leaderboard');
  });

  // Dismiss error
  errorDismiss?.addEventListener('click', () => {
    hideError();
    if (startButton) startButton.disabled = false;
  });
}

// Initialize
function init(): void {
  initEventListeners();
  console.log('Quiz app initialized');
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// TODO: Add functions for:
// - Error handling UI
// - Loading states
// - Quiz selection (multiple quizzes)
// - Answer review after completion
