import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSession } from '../entities/GameSession';
import { GameMove } from '../entities/GameMove';
import { GameGateway } from './game.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([GameSession, GameMove])],
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class GameModule {}
