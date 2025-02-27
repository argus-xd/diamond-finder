export default class Cell {
  board: any;
  open: boolean;
  x: number;
  y: number;
  value: string;

  constructor(board, x, y) {
    this.board = board;
    this.open = false;
    this.x = x;
    this.y = y;
    this.value = '🞘';
  }

  reset() {}

  action() {}
}
