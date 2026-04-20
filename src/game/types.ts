export type Mark = 'X' | 'O'

export type CellIndex = number // 0–8
export type BoardIndex = number // 0–8

export type CellValue = Mark | null
export type SmallBoardWinner = Mark | 'draw' | null

export interface SmallBoardState {
  cells: CellValue[] // length 9
  winner: SmallBoardWinner // null = still playable
}

export interface GameState {
  boards: SmallBoardState[] // length 9
  currentPlayer: Mark
  activeBoard: BoardIndex | null
  winner: Mark | 'draw' | null
  moveCount: number
  lastMove: Move | null
}

export interface Move {
  boardIndex: BoardIndex
  cellIndex: CellIndex
  player: Mark
}
