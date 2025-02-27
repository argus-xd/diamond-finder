import MissCell from './miss-cell';
import DiamondCell from './diamond-cell';
import { IBoard } from '../interfaces/IBoard';
import { ICell } from '../interfaces/ICell';

interface Position {
  rowIndex: number;
  colIndex: number;
}

export default class Board implements IBoard {
  public tiles: ICell[][];

  constructor(
    public rows: number,
    public cols: number,
    public diamondsCount: number
  ) {
    this.tiles = this.createBoard();
  }

  createBoard(): ICell[][] {
    const tiles = Array.from({ length: this.rows }, (_, x) =>
      Array.from({ length: this.cols }, (_, y) => new MissCell(this, x, y))
    );

    return this.initializeDiamondCell(tiles);
  }

  initializeDiamondCell(tiles: ICell[][]): ICell[][] {
    const totalDiamonds = this.diamondsCount;
    const actualDiamonds = totalDiamonds % 2 === 0 ? totalDiamonds - 1 : totalDiamonds;

    const allPositions: Position[] = [{ rowIndex: 0, colIndex: 0 }];
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      for (let colIndex = 0; colIndex < this.cols; colIndex++) {
        allPositions.push({ rowIndex, colIndex });
      }
    }

    for (let i = allPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
    }

    const diamondPositions = allPositions.slice(0, actualDiamonds);

    diamondPositions.forEach(({ rowIndex, colIndex }) => {
      tiles[rowIndex][colIndex] = new DiamondCell(this, rowIndex, colIndex);
    });

    return tiles;
  }

  neighborsTiles(x: number, y: number): string {
    const directions: [number, number][] = [
      [0, 1], [0, -1], [1, 0], [-1, 0],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    return directions.filter(([dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;
      const tile = this.getTile(newX, newY);
      return tile instanceof DiamondCell;
    }).length.toString();
  }

  getTile(x: number, y: number): ICell | null {
    try {
      return this.tiles[x][y];
    } catch {
      return null;
    }
  }

  openBoard(): void {
    this.tiles.flat().forEach(cell => cell.action());
  }

  normalizeBoard(): Record<string, any>[] {
    this.openBoard();
    return this.tiles.map(row =>
      row.map(cell => {
        const normalizedCell = { ...cell };
        // @ts-ignore
        delete normalizedCell.board;
        normalizedCell.type = cell.constructor.name;
        return normalizedCell;
      })
    );
  }
}
