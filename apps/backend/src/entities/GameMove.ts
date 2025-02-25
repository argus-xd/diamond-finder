import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { GameSession } from './GameSession';

@Entity()
@Unique(['session', 'row', 'col']) // Уникальный индекс для комбинации session, row и col
export class GameMove {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GameSession, { onDelete: 'CASCADE' })
  session: GameSession;

  @Column()
  playerToken: string;  // Какой игрок сделал ход

  @Column()
  row: number;

  @Column()
  col: number;

  @Column({ default: false })
  isDiamond: boolean;  // Нашёл ли алмаз

  @CreateDateColumn()
  createdAt: Date;
}
