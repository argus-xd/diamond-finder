export default class Cell {
  constructor(board, x, y) {
    this.board = board;
    this.open = false;
    this.x = x;
    this.y = y;
    this.value = '🞘';
  }

  reset() {
    this.mine = false;
    this.open = false;
    this.value = 0;
  }

  action() {}
}
