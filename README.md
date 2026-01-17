# Quiz App

A quiz application with a global leaderboard. Part of the Premier League prediction league suite.

## Features

- Take quizzes with multiple choice questions
- Score calculation with percentage display
- Global leaderboard showing best score per player
- Tie handling (same score = same rank)
- Answer review after completion
- Loading states and error handling
- Responsive design

## Tech Stack

- TypeScript
- Express (backend)
- Vite (frontend)
- Vitest (testing)

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the development servers

Start the backend server:

```bash
npm run build:server && npm run server
```

In a separate terminal, start the frontend dev server:

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Run tests

```bash
npm test
```

### Build for production

```bash
npm run build
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/quiz/:id` | Get quiz by ID |
| POST | `/api/quiz/:id/submit` | Submit quiz answers |
| GET | `/api/leaderboard` | Get global leaderboard |
| GET | `/api/leaderboard/player/:id` | Get player stats |
