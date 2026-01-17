
# Slice List - Quiz App

Vertical slices from top to bottom. Each slice delivers working end-to-end functionality.

---

## Slice 1: Server Boots & Frontend Loads ✅
**Goal:** Verify basic wiring works

- [x] Server starts without errors
- [x] Health endpoint returns `{ status: "ok" }`
- [x] Frontend loads in browser via Vite dev server
- [x] Console shows "Quiz app initialized"

**Test:** `npm run build:server && npm run server` + `npm run dev`

---

## Slice 2: Display a Quiz ✅
**Goal:** Fetch and render quiz questions (no submission yet)

- [x] Seed a default Premier League quiz on server start
- [x] GET `/api/quiz/default` returns quiz without correct answers
- [x] Frontend fetches quiz when "Start Quiz" clicked
- [x] First question renders with 4 options
- [x] Clicking option highlights it
- [x] "Next" button advances to next question

**Test:** Can click through all questions visually

---

## Slice 3: Submit & Score ✅
**Goal:** Submit answers and calculate score

- [x] POST `/api/quiz/:id/submit` accepts `{ playerName, answers }`
- [x] Server calculates score using `calculateScore()`
- [x] Server calculates percentage using `calculatePercentage()`
- [x] Response includes `{ score, totalQuestions, percentage, correctAnswers }`
- [x] Frontend shows results screen with score and percentage

**Test:** Complete quiz, see correct score on results screen

---

## Slice 4: Store Attempts ✅
**Goal:** Persist quiz attempts for leaderboard

- [x] Server creates/finds player by name
- [x] Server stores QuizAttempt in store
- [x] Attempt includes playerId, score, percentage, completedAt
- [x] Multiple submissions create multiple attempts

**Test:** Submit quiz twice, verify both attempts stored (via logs or debugger)

---

## Slice 5: Basic Leaderboard ✅
**Goal:** Display all attempts ranked by score

- [x] Implement `buildLeaderboard()` - return all attempts sorted
- [x] GET `/api/leaderboard` returns sorted entries with ranks
- [x] Frontend fetches and displays leaderboard
- [x] Leaderboard shows: rank, name, score, percentage
- [x] Top 3 have gold/silver/bronze styling

**Test:** Submit with different names/scores, see correct ordering

---

## Slice 6: Best Score Per Player ✅
**Goal:** Leaderboard shows only each player's best attempt

- [x] `buildLeaderboard()` groups attempts by player
- [x] Keeps only highest score per player
- [x] Same player submitting twice only appears once (with best score)

**Test:** Submit twice as "Alice" with scores 3 and 5, leaderboard shows only 5

---

## Slice 7: Tie Handling ✅
**Goal:** Players with same score share rank

- [x] Implement `assignRanks()` with tie logic
- [x] Same score + percentage = same rank
- [x] Next rank skips appropriately (1, 1, 3 not 1, 1, 2)
- [x] Ties broken by earlier completion time

**Test:** Two players with same score show same rank

---

## Slice 8: Player Stats ✅
**Goal:** View individual player statistics

- [x] GET `/api/leaderboard/player/:id` returns player's rank and stats
- [x] Includes total attempts count
- [x] Returns 404 for unknown player

**Test:** API returns correct stats for a player with multiple attempts

---

## Slice 9: Answer Review ✅
**Goal:** Show which answers were correct/incorrect after submission

- [x] Frontend receives `correctAnswers` from submit response
- [x] Results screen shows answer breakdown
- [x] Green for correct, red for incorrect
- [x] Shows what the correct answer was for wrong answers

**Test:** Complete quiz, see which questions were right/wrong

---

## Slice 10: Error Handling & Loading States ✅
**Goal:** Graceful handling of errors and async states

- [x] Loading spinner while fetching quiz
- [x] Loading spinner while submitting
- [x] Loading spinner while fetching leaderboard
- [x] Error message if API fails
- [x] Disable buttons during async operations

**Test:** Simulate slow/failed API, see appropriate UI feedback

---

## Slice 11: Multiple Quizzes (Stretch)
**Goal:** Support multiple quiz options

- [ ] Seed multiple quizzes with different topics
- [ ] Quiz selection screen before start
- [ ] GET `/api/quiz` returns list of available quizzes
- [ ] Leaderboard can filter by quiz

---

## Summary Order

| # | Slice | Core Deliverable |
|---|-------|------------------|
| 1 | Server Boots | Basic wiring verified |
| 2 | Display Quiz | See and navigate questions |
| 3 | Submit & Score | Get score after completion |
| 4 | Store Attempts | Attempts persisted |
| 5 | Basic Leaderboard | See ranked players |
| 6 | Best Per Player | One entry per player |
| 7 | Tie Handling | Proper shared ranks |
| 8 | Player Stats | Individual stats endpoint |
| 9 | Answer Review | See correct/incorrect |
| 10 | Error Handling | Polished UX |
| 11 | Multiple Quizzes | Stretch goal |

---

**Current Position:** Slice 10 complete! Core app finished. Slice 11 is stretch goal.
