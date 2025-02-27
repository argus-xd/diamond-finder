import { ICell } from '../interfaces/ICell';
import { IBoard } from '../interfaces/IBoard';


export default class Cell implements ICell {
  constructor(
    public board: IBoard,
    public x: number,
    public y: number,
    public open: boolean = false,
    public value: string = '🞘'
  ) {}

  reset(): void {}
  action(): void {}
}
