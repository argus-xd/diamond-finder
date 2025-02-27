import Cell from './cell';
import { IBoard } from '../interfaces/IBoard';


export default class MissCell extends Cell {
  constructor(board: IBoard, x: number, y: number) {
    super(board, x, y);
  }

  action(): void {
    this.open = true;
    this.value = this.board.neighborsTiles(this.x, this.y);
  }
}
