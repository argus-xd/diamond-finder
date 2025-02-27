import { Test } from '@nestjs/testing';
import { GameService } from '../game/game.service';
import { GameMove } from '../entities/game-move.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GameSession } from '../entities/game-session.entity';

describe('GameService', () => {
  let gameService: GameService;

  const mockGameSessionRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockGameMoveRepository = {
    find: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const [module] = await Promise.all([Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(GameSession),
          useValue: mockGameSessionRepository,
        },
        {
          provide: getRepositoryToken(GameMove),
          useValue: mockGameMoveRepository,
        },
        GameService
      ],

    }).compile()]);

    gameService = module.get<GameService>(GameService);
  });

  describe('determineWinner', () => {
    it.each([
      [
        [
          { playerToken: 'player1', isDiamond: true } as GameMove,
          { playerToken: 'player2', isDiamond: true } as GameMove,
          { playerToken: 'player1', isDiamond: true } as GameMove,
          { playerToken: 'player2', isDiamond: false } as GameMove,
          { playerToken: 'player2', isDiamond: false } as GameMove,
        ],
        'player1',
      ],
      [
        [
          { playerToken: 'player1', isDiamond: true } as GameMove,
          { playerToken: 'player2', isDiamond: true } as GameMove,
          { playerToken: 'player2', isDiamond: true } as GameMove,
        ],
        'player2',
      ],
      [
        [
          { playerToken: 'player1', isDiamond: true } as GameMove,
          { playerToken: 'player2', isDiamond: false } as GameMove,
          { playerToken: 'player2', isDiamond: false } as GameMove,
        ],
        'player1',
      ],
      [
        [], undefined
      ],
    ])('should return %s', (moves, expectedWinner) => {
      const winner = gameService['determineWinner'](moves);
      expect(winner).toBe(expectedWinner);
    });
  });

});
