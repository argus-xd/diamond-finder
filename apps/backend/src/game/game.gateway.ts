import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(GameGateway.name);

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('makeMove')
  async handleMakeMove(
    @MessageBody() data: { sessionId: number; token: string; x: number; y: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, x, y, token } = data;
    const gameSession = await this.gameService.getGameSession(sessionId, token);

    const board = gameSession.boardState;
    const tile = board[x][y];
    this.logger.log('handleMakeMove', tile);

    const gameSessionAfterMovies = await this.gameService.makeMove(sessionId, token, x, y);

    const boardWithMoves = {
      tiles: await this.gameService.getBoardStateWithMoves(sessionId, token),
      cols: gameSession.cols,
      rows: gameSession.rows,
      winnerToken: gameSessionAfterMovies.winnerToken,
      status: gameSessionAfterMovies.status,
      isPlayerOneTurn: gameSessionAfterMovies.isPlayerOneTurn,
    };

    // Отправка обновленного состояния игры обоим игрокам
    this.server.to(sessionId.toString()).emit('gameUpdated', boardWithMoves);
    this.server.to(sessionId.toString()).emit('debug', 'debug gameUpdated makeMove ' + `${sessionId}`);
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(@MessageBody() data: { sessionId: number; token: string }, @ConnectedSocket() client: Socket) {
    const { sessionId, token } = data;
    const gameSession = await this.gameService.getGameSession(sessionId, token);

    client.join(sessionId.toString());

    const boardWithMoves = {
      tiles: await this.gameService.getBoardStateWithMoves(sessionId, token),
      cols: gameSession.cols,
      rows: gameSession.rows,
      status: gameSession.status,
      winnerToken: gameSession.winnerToken,
      isPlayerOneTurn: gameSession.isPlayerOneTurn,
    };

    // Отправка обновленного состояния игры обоим игрокам
    this.server.to(gameSession.id.toString()).emit('gameUpdated', boardWithMoves);
  }

  @SubscribeMessage('tryJoinGame')
  async handleTryJoinGame(@MessageBody() sessionId: number, @ConnectedSocket() client: Socket) {
    const gameSession = await this.gameService.joinGameSession(sessionId);
    client.emit('tryJoinGame', { sessionId, token: gameSession.playerTwoToken });
  }
}
