# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Type-check + build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
npx vitest         # Run all tests
npx vitest run src/path/to/file.test.tsx  # Run a single test file
```

## Tech Stack

- **React 19** + **TypeScript** — UI
- **Vite 8** — bundler/dev server
- **Zustand** — global state management
- **PeerJS** — WebRTC peer-to-peer multiplayer
- **Tailwind CSS 4** — styling via `@tailwindcss/postcss` in `postcss.config.js`; CSS entry uses `@import "tailwindcss"`
- **Vitest 4** + **@testing-library/react** — testing; configured in `vite.config.ts` via `vitest/config`'s `defineConfig`, jsdom environment, globals enabled

## Architecture

This is Ultimate Tic-Tac-Toe — a 3×3 grid of 3×3 boards where the small board you must play in is determined by your opponent's last move.

State is managed with **Zustand** stores (to be built in `src/store/`). Game logic lives separately from UI components so it can be unit-tested without rendering. PeerJS handles the P2P connection layer for online play.

Source lives entirely under `src/`. The entry point is [src/main.tsx](src/main.tsx) → [src/App.tsx](src/App.tsx).

## TypeScript Config Notes

`tsconfig.app.json` enforces `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly`. Avoid `enum` — use `const` objects or union types instead.
