import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { Logger } from '@nestjs/common';
import { GameSession } from '../entities/game-session.entity';

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(GameGateway.name);

  constructor(private readonly gameService: GameService) {}

  private async emitGameState(gameSession:GameSession) {
    const boardWithMoves = {
      tiles: await this.gameService.getBoardStateWithMoves(gameSession),
      cols: gameSession.cols,
      rows: gameSession.rows,
      winnerToken: gameSession.winnerToken,
      status: gameSession.status,
      isPlayerOneTurn: gameSession.isPlayerOneTurn,
    };

    this.server.to(gameSession.id.toString()).emit('gameUpdated', boardWithMoves);
  }

  @SubscribeMessage('makeMove')
  async handleMakeMove(
    @MessageBody() data: { sessionId: number; token: string; x: number; y: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, token, x, y } = data;

    const gameSessionAfterMoves = await this.gameService.makeMove(sessionId, token, x, y);
    await this.emitGameState(gameSessionAfterMoves);
    this.logger.debug(`Game updated after move in session ${sessionId}`);
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(@MessageBody() data: { sessionId: number; token: string }, @ConnectedSocket() client: Socket) {
    const { sessionId, token } = data;
    const session = await this.gameService.getGameSession(sessionId, token);
    client.join(sessionId.toString());
    await this.emitGameState(session);
  }

  @SubscribeMessage('tryJoinGame')
  async handleTryJoinGame(@MessageBody() sessionId: number, @ConnectedSocket() client: Socket) {
    const gameSession = await this.gameService.joinGameSession(sessionId);
    client.emit('tryJoinGame', { sessionId, token: gameSession.playerTwoToken });
  }
}
