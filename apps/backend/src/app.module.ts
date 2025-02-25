import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSession } from './entities/GameSession';
import { GameMove } from './entities/GameMove';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [GameSession, GameMove],
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    GameModule, // Добавляем GameModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
