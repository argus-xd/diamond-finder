
import Cell from '@/models/Cell';
import socketService from '@/services/SocketService';

export default class Board {
  constructor(data, callBackForceUpdate) {
    const { rows, cols, sessionId, token } = data;

    this.rows = rows;
    this.cols = cols;
    this.sessionId = sessionId;
    this.token = token;
    this.winnerToken = '';
    this.tiles = [];
    this.status = '';
    this.isPlayerOneTurn = '';

    // Обработка обновлений состояния игры
    socketService.onGameUpdate((boardWithMoves) => {
      console.log(boardWithMoves);
      this.updateBoard(boardWithMoves);
      callBackForceUpdate(); // КОСТЫЛЬ для обновления компонента
    });

    // Присоединение к игре
    socketService.joinGame(sessionId, token);
  }

  updateBoard(boardWithMoves) {
    this.rows = boardWithMoves.rows;
    this.cols = boardWithMoves.cols;
    this.status = boardWithMoves.status;
    this.winnerToken = boardWithMoves.winnerToken;
    this.isPlayerOneTurn = boardWithMoves.isPlayerOneTurn;

    const tiles =  Array.from({ length: this.rows }, (_, x) =>
      Array.from({ length: this.cols }, (_, y) => new Cell(this, x, y)),
    );

    for (const move of boardWithMoves.tiles) {
      tiles[move.x][move.y] = move;
    }

    this.tiles = tiles;
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
      return;
    }

    socketService.makeMove(move);
  }

}
