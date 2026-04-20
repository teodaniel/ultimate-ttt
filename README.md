# Ultimate Tic-Tac-Toe

A web-based Ultimate Tic-Tac-Toe game with local hot-seat play and peer-to-peer online multiplayer — no backend, no accounts.

## How to play

Ultimate Tic-Tac-Toe is played on a 3×3 grid of 3×3 boards (81 cells total). Two players take turns: **X** goes first.

**The twist:** the cell you play in determines which small board your opponent must play in next. Play in the top-right cell of any board, and your opponent must play in the top-right board.

- If you're sent to a board that's already won or full, you can play in any open board.
- Win a small board by getting three in a row on it (standard tic-tac-toe).
- Win the game by winning three small boards in a row on the big board.
- A full board with no winner is a draw and counts for neither player.

## Modes

- **Local (hot-seat)** — two players on the same device, taking turns.
- **Online** — create a game, share the invite link, and play against someone on a different device over a direct peer-to-peer connection.

## Running locally

```bash
npm install
npm run dev
```

Other commands:

```bash
npm run build    # production build
npm run lint     # ESLint
npm test         # run all tests
```

## Tech stack

React 19 · TypeScript · Vite · Zustand · PeerJS · Tailwind CSS 4 · Vitest
