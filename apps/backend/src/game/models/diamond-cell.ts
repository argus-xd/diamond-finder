import Cell from './cell';
import { IBoard } from '../interfaces/IBoard';


export default class DiamondCell extends Cell {
  public diamond: boolean = false;

  constructor(board: IBoard, x: number, y: number) {
    super(board, x, y);
  }

  action(): void {
    this.open = true;
    this.diamond = true;
    this.value = '💎';
  }
}
