import MissCell from './MissCell';
import DiamondCell from './DiamondCell';

export default class Board {
  rows: number;
  cols: number;
  diamondsCount: number;
  tiles: any[];

  constructor(rows, cols, diamondsCount) {
    this.rows = rows;
    this.cols = cols;
    this.diamondsCount = diamondsCount;
    this.tiles = this.createBoard();
  }

  createBoard() {
    const tiles =  Array.from({ length: this.rows }, (_, x) =>
      Array.from({ length: this.cols }, (_, y) => new MissCell(this, x, y)),
    );

    return this.initializeDiamondCell(tiles)
  }

  initializeDiamondCell(tiles) {
    const totalDiamonds = this.diamondsCount;

    // Убедитесь, что количество алмазов нечетное
    const actualDiamonds = totalDiamonds % 2 === 0 ? totalDiamonds - 1 : totalDiamonds;

    // Создаем массив всех возможных позиций
    const allPositions = [{ rowIndex: 0, colIndex: 0}];
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      for (let colIndex = 0; colIndex < this.cols; colIndex++) {
        allPositions.push({ rowIndex, colIndex });
      }
    }

    // Перемешиваем массив позиций
    for (let i = allPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
    }

    // Выбираем первые `actualDiamonds` позиций для алмазов
    const diamondPositions = allPositions.slice(0, actualDiamonds);

    // Размещаем алмазы на выбранных позициях
    diamondPositions.forEach(({ rowIndex, colIndex }) => {
      const diamondCell = new DiamondCell(this, rowIndex, colIndex);
      tiles[rowIndex][colIndex] = diamondCell;
    });

    return tiles;
  }


  // initializeDiamondCell(tiles ) {
  //   const cols = tiles.length;
  //   const rows = tiles[0].length;
  //
  //   const totalDiamonds = this.diamondsCount;
  //
  //   const diamondTiles:any[] = [];
  //   tiles.forEach((row, rowIndex) => {
  //     row.forEach((tile, colIndex) => {
  //       if (diamondTiles.length < totalDiamonds) {
  //         const randDiamond = Math.random() < (totalDiamonds / (rows * cols));
  //
  //         if (randDiamond) {
  //           const diamondCell = new DiamondCell(this, rowIndex, colIndex);
  //           tiles[rowIndex][colIndex] = diamondCell; //  меняем ячейку
  //           diamondTiles.push(diamondCell);
  //         }
  //       }
  //     });
  //   });
  //
  //   if (diamondTiles.length % 2 === 0 && diamondTiles.length > 0) {
  //     const lastDiamond = diamondTiles.pop();
  //     tiles[lastDiamond.x][lastDiamond.y] = new MissCell(this, lastDiamond.x, lastDiamond.y);
  //   }
  //
  //   return tiles;
  // }

  neighborsTiles(x, y) {
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    const neighbors = directions.filter(([dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;
      const tile = this.getTile(newX, newY);
      if (tile instanceof DiamondCell) {
        return tile;
      }
    });

    return neighbors.length;
  }

  getTile(x, y) {
    try {
      return this.tiles[x][y];
    } catch {
      return null;
    }
  }

  openBoard() {
    this.tiles.flat().forEach(cell => cell.action());
  }

  normalizeBoard() {
    this.openBoard();
    return this.tiles.map(row =>
        row.map(cell => {
          const normalizedCell = { ...cell };
          delete normalizedCell.board;
          normalizedCell.type = cell.constructor.name;
          return normalizedCell;
        })
      )
  }
}