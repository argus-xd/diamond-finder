import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { GameSession } from './game-session.entity';

@Entity()
@Unique(['session', 'row', 'col']) // Уникальный индекс для комбинации session, row и col
export class GameMove {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GameSession, { onDelete: 'CASCADE' })
  session: GameSession;

  @Column()
  playerToken: string;

  @Column()
  row: number;

  @Column()
  col: number;

  @Column({ default: false })
  isDiamond: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
