import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'game_user',
  password: process.env.DATABASE_PASSWORD || 'game_password',
  database: process.env.DATABASE_NAME || 'game_db',
  synchronize: false, // отключаем в продакшене!
  logging: true,
  entities: ['./apps/backend/dist/entities/*.js'],
  migrations: ['./apps/backend/dist/migrations/*.js'],
  subscribers: [],
});
