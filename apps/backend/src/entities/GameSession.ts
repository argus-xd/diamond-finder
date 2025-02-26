import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished'
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
  status: GameStatus;

  @Column({ nullable: true })
  winnerToken?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
