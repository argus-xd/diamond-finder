import { Body, Controller, Post } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('create')
  async createGameSession(@Body() createGameDto: { rows: number; cols: number, diamonds: number }) {
    return await this.gameService.createGameSession(createGameDto.rows, createGameDto.cols, createGameDto.diamonds);
  }
}
