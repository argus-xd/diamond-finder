import Cell from './Cell';

export default class MissCell extends Cell {
  action() {
    this.open = true;
    this.value = this.board.neighborsTiles(this.x, this.y);
  }
}
