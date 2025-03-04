import { Body, Controller, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('create')
  async createGameSession(@Body() createGameDto: CreateGameDto) {
    return await this.gameService.createGameSession(createGameDto.rows, createGameDto.cols, createGameDto.diamonds);
  }
}
