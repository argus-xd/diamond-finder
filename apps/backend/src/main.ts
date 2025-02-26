import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const logger = new Logger('Main');
  logger.log('Application is running');
  app.enableCors();

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
