import { ICell } from './ICell';

export interface IBoard {
  rows: number;
  cols: number;
  tiles: ICell[][];

  neighborsTiles(x: number, y: number): string;

  getTile(x: number, y: number): ICell | null;
}
