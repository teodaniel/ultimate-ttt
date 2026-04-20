import { describe, it, expect } from 'vitest'
import type { CellValue, SmallBoardState } from './types'
import {
  createInitialState,
  isValidMove,
  applyMove,
  checkSmallBoardWinner,
  checkBigBoardWinner,
} from './logic'

function cells(s: string): CellValue[] {
  return s.split('').map(c => (c === 'X' ? 'X' : c === 'O' ? 'O' : null))
}

function emptySmallBoard(): SmallBoardState {
  return { cells: Array(9).fill(null), winner: null }
}

// ─── 1. createInitialState ───────────────────────────────────────────────────

describe('createInitialState', () => {
  it('returns X to move, no active board, 9 empty boards, no winner', () => {
    const s = createInitialState()
    expect(s.currentPlayer).toBe('X')
    expect(s.activeBoard).toBeNull()
    expect(s.winner).toBeNull()
    expect(s.moveCount).toBe(0)
    expect(s.lastMove).toBeNull()
    expect(s.boards).toHaveLength(9)
    s.boards.forEach(b => {
      expect(b.winner).toBeNull()
      expect(b.cells).toHaveLength(9)
      b.cells.forEach(c => expect(c).toBeNull())
    })
  })
})

// ─── 2–4. checkSmallBoardWinner ──────────────────────────────────────────────

describe('checkSmallBoardWinner', () => {
  it('detects all 8 winning lines for X', () => {
    const lines = [
      'XXX......', '...XXX...', '......XXX',
      'X..X..X..', '.X..X..X.', '..X..X..X',
      'X...X...X', '..X.X.X..',
    ]
    lines.forEach(line => expect(checkSmallBoardWinner(cells(line))).toBe('X'))
  })

  it('detects all 8 winning lines for O', () => {
    const lines = [
      'OOO......', '...OOO...', '......OOO',
      'O..O..O..', '.O..O..O.', '..O..O..O',
      'O...O...O', '..O.O.O..',
    ]
    lines.forEach(line => expect(checkSmallBoardWinner(cells(line))).toBe('O'))
  })

  it("returns 'draw' on a full board with no winner", () => {
    // X O X / O O X / X X O — no three in a row, all 9 filled
    expect(checkSmallBoardWinner(cells('XOXOOXXX.'))).toBeNull() // one empty → not a draw yet
    expect(checkSmallBoardWinner(cells('XOXOOXXXO'))).toBe('draw')
  })

  it('returns null on an incomplete board with no winner', () => {
    expect(checkSmallBoardWinner(cells('X........'))).toBeNull()
    expect(checkSmallBoardWinner(cells('XO.......'))).toBeNull()
  })
})

// ─── 5–8. isValidMove ────────────────────────────────────────────────────────

describe('isValidMove', () => {
  it('rejects moves on occupied cells', () => {
    const s = applyMove(createInitialState(), 0, 0) // X at b0c0
    expect(isValidMove(s, 0, 0)).toBe(false)
  })

  it('rejects moves outside the active board when one is set', () => {
    const s = applyMove(createInitialState(), 0, 4) // sends O to board 4
    expect(s.activeBoard).toBe(4)
    expect(isValidMove(s, 0, 1)).toBe(false)
    expect(isValidMove(s, 4, 0)).toBe(true)
  })

  it('allows any non-completed board when activeBoard is null', () => {
    const s = createInitialState()
    expect(s.activeBoard).toBeNull()
    expect(isValidMove(s, 0, 0)).toBe(true)
    expect(isValidMove(s, 5, 7)).toBe(true)
    expect(isValidMove(s, 8, 8)).toBe(true)
  })

  it('rejects moves on already-won small boards', () => {
    const s = createInitialState()
    const boards = s.boards.map((b: SmallBoardState, i: number) =>
      i === 0 ? { ...b, winner: 'X' as const } : b
    )
    expect(isValidMove({ ...s, boards }, 0, 5)).toBe(false)
  })

  it('rejects all moves when game is already won', () => {
    const s = { ...createInitialState(), winner: 'X' as const }
    expect(isValidMove(s, 0, 0)).toBe(false)
  })
})

// ─── 9–13. applyMove ─────────────────────────────────────────────────────────

describe('applyMove', () => {
  it('updates cells, currentPlayer, moveCount, and lastMove', () => {
    const s = applyMove(createInitialState(), 3, 7)
    expect(s.boards[3].cells[7]).toBe('X')
    expect(s.currentPlayer).toBe('O')
    expect(s.moveCount).toBe(1)
    expect(s.lastMove).toEqual({ boardIndex: 3, cellIndex: 7, player: 'X' })
  })

  it('sets the correct activeBoard based on which cell was played', () => {
    const s = applyMove(createInitialState(), 0, 5)
    expect(s.activeBoard).toBe(5)
  })

  it('sets activeBoard to null when the target board is already completed', () => {
    const wonBoard: SmallBoardState = {
      cells: ['X', 'X', 'X', 'O', 'O', null, null, null, null],
      winner: 'X',
    }
    const boards = createInitialState().boards.map((b, i) => i === 6 ? wonBoard : b)
    // Playing cell index 6 → would normally send to board 6, but board 6 is won
    const s = applyMove({ ...createInitialState(), boards }, 0, 6)
    expect(s.activeBoard).toBeNull()
  })

  it('marks a small board as won when three in a row are placed', () => {
    // X wins board 0 top row: cells 0, 1, 2
    let s = createInitialState()
    s = applyMove(s, 0, 0) // X@b0c0 → O to b0
    s = applyMove(s, 0, 3) // O@b0c3 → X to b3
    s = applyMove(s, 3, 1) // X@b3c1 → O to b1
    s = applyMove(s, 1, 0) // O@b1c0 → X to b0
    s = applyMove(s, 0, 1) // X@b0c1 → O to b1
    s = applyMove(s, 1, 3) // O@b1c3 → X to b3
    s = applyMove(s, 3, 2) // X@b3c2 → O to b2
    s = applyMove(s, 2, 0) // O@b2c0 → X to b0
    s = applyMove(s, 0, 2) // X@b0c2 → X wins board 0!
    expect(s.boards[0].winner).toBe('X')
  })

  it("marks a small board as 'draw' when filled without a winner", () => {
    // Board 0: X has cells 0..7 via play; O fills last to create a draw pattern
    // Directly construct near-draw state for board 0
    // X O X / O O X / X X _ (cell 8 empty, O to fill → draw: XOXOOXXX O)
    const drawCells: CellValue[] = ['X','O','X','O','O','X','X','X',null]
    const boards = createInitialState().boards.map((b, i) =>
      i === 0 ? { cells: drawCells, winner: null } : b
    )
    const s = { ...createInitialState(), boards, activeBoard: 0, currentPlayer: 'O' as const }
    const result = applyMove(s, 0, 8)
    expect(result.boards[0].winner).toBe('draw')
  })
})

// ─── 14–16. checkBigBoardWinner ──────────────────────────────────────────────

describe('checkBigBoardWinner', () => {
  it('recognizes a player winning 3 small boards in a row', () => {
    const boards: SmallBoardState[] = Array.from({ length: 9 }, (_, i) =>
      [0, 1, 2].includes(i)
        ? { ...emptySmallBoard(), winner: 'X' as const }
        : emptySmallBoard()
    )
    expect(checkBigBoardWinner(boards)).toBe('X')
  })

  it("does not count 'draw' small boards toward either player's line", () => {
    // All boards drawn except board 0 which is empty — no winner possible
    const boards: SmallBoardState[] = Array.from({ length: 9 }, (_, i) =>
      i === 0 ? emptySmallBoard() : { ...emptySmallBoard(), winner: 'draw' as const }
    )
    expect(checkBigBoardWinner(boards)).toBeNull()
  })

  it("returns 'draw' when all 9 small boards are complete and no player has a line", () => {
    const boards: SmallBoardState[] = Array.from({ length: 9 }, () => ({
      ...emptySmallBoard(),
      winner: 'draw' as const,
    }))
    expect(checkBigBoardWinner(boards)).toBe('draw')
  })
})

// ─── 17. Full game sequence ───────────────────────────────────────────────────

describe('full game sequence ending in X winning', () => {
  it('applyMove propagates big-board win when X takes three small boards in a row', () => {
    // Construct state where X has won boards 0 and 1, and needs board 2 cell 2 to win
    const xWon: SmallBoardState = { cells: Array(9).fill('X'), winner: 'X' }
    const b2cells: CellValue[] = ['X', 'X', null, 'O', 'O', null, null, null, null]
    const boards = createInitialState().boards.map((b, i) => {
      if (i === 0 || i === 1) return xWon
      if (i === 2) return { cells: b2cells, winner: null }
      return b
    })
    const s = {
      ...createInitialState(),
      boards,
      activeBoard: 2,
      currentPlayer: 'X' as const,
    }
    const final = applyMove(s, 2, 2)
    expect(final.boards[2].winner).toBe('X')
    expect(final.winner).toBe('X')
    // No further moves accepted
    expect(isValidMove(final, 3, 0)).toBe(false)
  })
})
