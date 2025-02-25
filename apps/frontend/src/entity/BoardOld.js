// import io from 'socket.io-client';
//
// const socket = io('http://localhost:3001'); // URL вашего сервера
//
//
//
// //         const move = {
// //             sessionId: '1',
// //             token: '1q2s4r',
// //             x: 0,
// //             y: 0,
// //         };
// //
// // // Выполнение хода
// //         socket.emit('makeMove', move);
//
// // // Завершение игры
// // socket.emit('finishGame', { sessionId, token });
//
//
//
// // Обработка завершения игры
// socket.on('gameFinished', (gameSession) => {
//
//     console.error('gameFinished:', gameSession);
//   // Отображение результатов игры
// });
//
// // Обработка ошибок
// socket.on('error', (message) => {
//   console.error('Error:', message);
// });
//
//
// import MissCell from '@/entity/MissCell';
// import DiamondCell from '@/entity/DiamondCell';
//
// export default class Board {
//   constructor(rows, cols, sessionId, token) {
//     this.rows = rows;
//     this.cols = cols;
//     this.diamondTiles = [];
//     this.tilesQ = this.createBoard();
//     this.tilesQ = this.createBoard();
//     // this.initializeDiamondCell();
//     // this.openBoard();
//
//     // Обработка обновлений состояния игры
//     socket.on('gameUpdated', (gameSession) => {
//
//       console.log('gameUpdated start');
//       console.log(gameSession);
//       console.log('gameUpdated end');
//
//       this.rows = gameSession.rows;
//       this.cols = gameSession.cols;
//       this.tiles = gameSession.boardState;
//       this.initializeDiamondCell();
//       // this.openBoard();
//
//
//       // Обновление интерфейса игры
//     });
//     // Присоединение к игре
//     socket.emit('joinGame', { sessionId: sessionId, token: token });
//   }
//
//   createBoard() {
//     return Array.from({ length: 5 }, (_, x) =>
//       Array.from({ length: 5 }, (_, y) => new MissCell(this, x, y)),
//     );
//   }
//
//   initializeDiamondCell() {
//     const totalDiamonds = Math.floor((this.rows * this.cols) * 0.3); // 10% от площади
//
//     console.log(totalDiamonds);
//
//     this.tiles.forEach((row, rowIndex) => {
//       row.forEach((tile, colIndex) => {
//         if (this.diamondTiles.length < totalDiamonds) {
//           const randDiamond = Math.random() < (totalDiamonds / (this.rows * this.cols));
//
//           if (randDiamond) {
//             const diamondCell = new DiamondCell(this, rowIndex, colIndex);
//             this.tiles[rowIndex][colIndex] = diamondCell; // Теперь просто меняем ячейку!
//             this.diamondTiles.push(diamondCell);
//           }
//         }
//       });
//     });
//
//     if (this.diamondTiles.length % 2 === 0 && this.diamondTiles.length > 0) {
//       const lastDiamond = this.diamondTiles.pop();
//       this.tiles[lastDiamond.x][lastDiamond.y] = new MissCell(this, lastDiamond.x, lastDiamond.y);
//     }
//   }
//
//   neighborsTiles(x, y) {
//     const directions = [
//       [0, 1],
//       [0, -1],
//       [1, 0],
//       [-1, 0],
//       [1, 1],
//       [1, -1],
//       [-1, 1],
//       [-1, -1],
//     ];
//
//     const neighbors = directions.filter(([dx, dy]) => {
//       const newX = x + dx;
//       const newY = y + dy;
//       const tile = this.getTile(newX, newY);
//       if (tile instanceof DiamondCell) {
//         return tile;
//       }
//     });
//
//     return neighbors.length;
//   }
//
//   actionTile(x, y) {
//     const move = {
//       sessionId: '1',
//       token: '1q2s4r',
//       x: 0,
//       y: 0,
//     };
//
//     socket.emit('makeMove', move);
//
//
//     this.getTile(x, y).action();
//   }
//
//   getTile(x, y) {
//     try {
//       return this.tiles[x][y];
//     } catch {
//       return null;
//     }
//   }
//
//   openBoard() {
//     this.tiles.flat().forEach(cell => cell.action());
//   }
// }