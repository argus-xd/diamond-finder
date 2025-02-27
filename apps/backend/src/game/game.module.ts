import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSession } from '../entities/game-session.entity';
import { GameMove } from '../entities/game-move.entity';
import { GameGateway } from './game.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([GameSession, GameMove])],
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class GameModule {}
