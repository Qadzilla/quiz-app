// Server entry point

import { createApp } from './app.js';
import { seedDefaultQuiz } from '../domain/store.js';

const PORT = process.env['PORT'] ?? 3000;

// Seed initial data
seedDefaultQuiz();

const app = createApp();

app.listen(PORT, () => {
  console.log(`Quiz server running on http://localhost:${PORT}`);
});
