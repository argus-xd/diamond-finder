import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { GameSession } from '../entities/game-session.entity';
import { GameMove } from '../entities/game-move.entity';
import Board from './models/board';
import { GameStatus } from '../enum/game-status';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameSession)
    private readonly gameSessionRepository: Repository<GameSession>,
    @InjectRepository(GameMove)
    private readonly gameMoveRepository: Repository<GameMove>,
  ) {}

  // Создание новой игровой сессии для первого игрока
  async createGameSession(rows: number, cols: number, diamonds: number): Promise<{ id: number; token: string }> {
    const board = new Board(rows, cols, diamonds);
    const boardState = board.normalizeBoard();
    const gameSession = this.gameSessionRepository.create({
      playerOneToken: uuidv4(),
      status: GameStatus.WAITING,
      boardState,
      rows,
      cols,
    });
    await this.gameSessionRepository.save(gameSession);

    return { id: gameSession.id, token: gameSession.playerOneToken }; // Возвращаем объект сессии, чтобы перенаправить на её страницу
  }

  // Присоединение второго игрока к сессии
  async joinGameSession(sessionId: number): Promise<GameSession> {
    const gameSession = await this.gameSessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!gameSession) throw new NotFoundException('Game session not found');
    if (gameSession.playerTwoToken) throw new UnauthorizedException('Game already full');

    // Регистрируем второго игрока
    gameSession.playerTwoToken = uuidv4();
    gameSession.status = GameStatus.IN_PROGRESS;
    await this.gameSessionRepository.save(gameSession);

    return gameSession;
  }

  async getGameSession(sessionId: number, token: string): Promise<GameSession> {
    const gameSession = await this.gameSessionRepository.findOne({ where: { id: sessionId } });
    if (!gameSession) throw new NotFoundException('Game session not found');
    if (gameSession.playerOneToken !== token && gameSession.playerTwoToken !== token)
      throw new UnauthorizedException('Invalid player token');

    return gameSession;
  }

  async makeMove(sessionId: number, token: string, x: number, y: number): Promise<GameSession> {
    const gameSession = await this.getGameSession(sessionId, token);
    if (gameSession.status !== GameStatus.IN_PROGRESS) return gameSession;

    if (![gameSession.playerOneToken, gameSession.playerTwoToken].includes(token)) {
      throw new UnauthorizedException('Invalid player token');
    }

    const isPlayerOne = gameSession.playerOneToken === token;
    if (gameSession.isPlayerOneTurn !== isPlayerOne) {
      return gameSession;
    }

    const tile = gameSession.boardState[x][y];
    const isDiamond = !!tile['diamond'];

    const gameMove = this.gameMoveRepository.create({
      session: gameSession,
      playerToken: token,
      row: x,
      col: y,
      isDiamond,
    });

    await this.gameMoveRepository.save(gameMove);

    if (!isDiamond) {
      // После выполнения хода переключаем очередь
      gameSession.isPlayerOneTurn = !gameSession.isPlayerOneTurn;
    }
    await this.gameSessionRepository.save(gameSession);

    await this.finishGame(gameSession);

    return gameSession;
  }

  async finishGame(gameSession: GameSession): Promise<GameSession> {
    const moves = await this.gameMoveRepository.find({
      where: { session: { id: gameSession.id } },
    });

    if (gameSession.cols * gameSession.rows <= moves.length) {
      const crystalCounts: { [token: string]: number } = {};

      // Подсчет кристаллов для каждого игрока
      moves.forEach((move) => {
        if (move.isDiamond) {
          if (!crystalCounts[move.playerToken]) {
            crystalCounts[move.playerToken] = 0;
          }
          crystalCounts[move.playerToken]++;
        }
      });

      const playerTokens = Object.keys(crystalCounts);

      const winnerToken =
        crystalCounts[playerTokens[0]] > crystalCounts[playerTokens[1]] ? playerTokens[0] : playerTokens[1];

      gameSession.status = GameStatus.FINISHED;
      gameSession.winnerToken = winnerToken;
    }

    return this.gameSessionRepository.save(gameSession);
  }

  async getBoardStateWithMoves(gameSession: GameSession): Promise<any[]> {
    const moves = await this.gameMoveRepository.find({
      where: { session: { id: gameSession.id } }, // Используйте только ID сессии
      order: { createdAt: 'ASC' },
    });

    const board = gameSession.boardState as [][];
    const result = [];

    for (const move of moves) {
      const { row, col, isDiamond } = move;

      result.push(board[row][col]);
    }
    return result;
  }
}
