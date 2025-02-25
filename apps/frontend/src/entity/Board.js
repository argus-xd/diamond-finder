import io from 'socket.io-client';
import Cell from '@/entity/Cell';

const socket = io(process.env.VUE_APP_GAME_SERVICE_HOST); // URL вашего сервера

// // Завершение игры
// socket.emit('finishGame', { sessionId, token });


// Обработка завершения игры
socket.on('gameFinished', (gameSession) => {

  console.error('gameFinished:', gameSession);
  // Отображение результатов игры
});

// Обработка ошибок
socket.on('error', (message) => {
  console.error('Error:', message);
});


socket.on('debug', (message) => {
  console.warn('debug:', message);
});

export default class Board {
  constructor(data, callBackForceUpdate) {
    const { rows, cols, sessionId, token } = data;

    this.rows = rows;
    this.cols = cols;
    this.sessionId = sessionId;
    this.token = token;
    this.winnerToken = '';
    this.diamondTiles = [];
    this.tiles = [
      [{}, {}, {}],
      [{}, {}, {}],
    ];
    this.status = '';
    this.isPlayerOneTurn = '';

    // this.initializeDiamondCell();
    // this.openBoard();

    // Обработка обновлений состояния игры
    socket.on('gameUpdated', (boardWithMoves) => {

      console.log('gameUpdated start');
      console.log(boardWithMoves);
      console.log('gameUpdated end');
      this.updateBoard(boardWithMoves);

      callBackForceUpdate(boardWithMoves); // КОСТЫЛЬ удалить gameSession
    });

    // Присоединение к игре
    socket.emit('joinGame', { sessionId: sessionId, token: token });
  }

  updateBoard(boardWithMoves) {
    this.rows = boardWithMoves.rows;
    this.cols = boardWithMoves.cols;
    this.status = boardWithMoves.status;
    this.winnerToken = boardWithMoves.winnerToken;
    this.isPlayerOneTurn = boardWithMoves.isPlayerOneTurn;

    // this.tiles = gameSession.boardState;
    const tiles =  Array.from({ length: this.rows }, (_, x) =>
      Array.from({ length: this.cols }, (_, y) => new Cell(this, x, y)),
    );

    for (const move of boardWithMoves.tiles) {
      tiles[move.x][move.y] = move;
    }

    this.tiles = tiles;

    // this.initializeDiamondCell();
    // this.openBoard();
    console.log(this);
  }

  getTile(x, y) {
    try {
      return this.tiles[x][y];
    } catch {
      return null;
    }
  }

  openTile(x, y) {
    const move = {
      sessionId: this.sessionId,
      token: this.token,
      x,
      y,
    };

    if(this.tiles[x][y].open){
      console.log(x, y, 'is opened');
      return
    }

    console.log(x, y);
    socket.emit('makeMove', move);
  }

}
