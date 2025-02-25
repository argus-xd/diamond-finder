import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum GameStatus {
  WAITING = 'waiting', // Ожидание второго игрока
  IN_PROGRESS = 'in_progress', // Игра идёт
  FINISHED = 'finished' // Игра завершена
}

@Entity()
export class GameSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  playerOneToken: string;

  @Column({ unique: true, nullable: true })
  playerTwoToken: string;

  @Column('jsonb')
  boardState: any;

  @Column()
  rows: number;

  @Column()
  cols: number;

  @Column({ default: true })
  isPlayerOneTurn: boolean; // true, если ход первого игрока, иначе false

  @Column({ type: 'enum', enum: GameStatus, default: GameStatus.WAITING })
  status: GameStatus; // Статус сессии

  @Column({ nullable: true })
  winnerToken?: string; // Кто победил (null, если игра не завершена)

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}