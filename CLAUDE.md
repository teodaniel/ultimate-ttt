# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project summary

Web-based Ultimate Tic-Tac-Toe with local hot-seat and peer-to-peer online multiplayer. No backend — PeerJS handles WebRTC signaling. Game logic is pure TypeScript, fully unit-tested, and completely decoupled from React.

## Commands

```bash
npm run dev      # start dev server
npm run build    # type-check + production build
npm run lint     # ESLint
npm test         # run all tests (Vitest)
npm test -- --run src/game/logic.test.ts  # single test file
```

## Architecture rules

- `src/game/` is pure TypeScript — zero imports from React, Zustand, or PeerJS. This is a hard rule; verify before touching those files.
- All game logic functions are pure (no mutation, no side effects). State transitions happen only in `src/store/gameStore.ts`.
- The Zustand store never calls `peer.send`. Sending is always the responsibility of the component that called `makeMove`.
- `makeMove` and `applyRemoteMove` in the store are intentionally separate — same implementation, different semantic meaning for the network layer.
- URL params (`?join=`) are read at module level in `App.tsx`, not inside a `useEffect`, to avoid cascading render issues.

## Known gotchas

- **Tailwind v4** does not use `tailwindcss` directly as a PostCSS plugin. It requires `@tailwindcss/postcss` as a separate package, and the CSS entry point uses `@import "tailwindcss"` rather than the v3 `@tailwind` directives.
- **Vitest v4** config must use `defineConfig` imported from `vitest/config`, not from `vite`. Using `vite`'s `defineConfig` will reject the `test` field.
- **ESLint** does not respect the `_` prefix for unused parameters by default — `@typescript-eslint/no-unused-vars` needs `argsIgnorePattern: "^_"` set explicitly in `eslint.config.js`. TypeScript itself does respect the prefix natively.
- **Ref updates during render** are flagged by the `react-hooks/refs` rule. The `onMessageRef.current = value` pattern must be inside a `useEffect`, not at the top level of the hook body.
- **Calling setState inside useEffect** is flagged by `react-hooks/set-state-in-effect`. Initialization from URL params should happen at module scope or via lazy `useState` initializers, not in an effect.
