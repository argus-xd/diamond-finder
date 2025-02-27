import { IBoard } from './IBoard';

export interface ICell {
  board: IBoard;
  open: boolean;
  x: number;
  y: number;
  value: string;
  type?: string;

  reset(): void;

  action(): void;
}
