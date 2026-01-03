import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * UserStreak entity tracks daily visit streaks (like Duolingo)
 * Encourages daily engagement through streak maintenance
 */
@Entity('user_streaks')
export class UserStreak {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true })
  userId: string;

  @Column({ default: 0 })
  currentStreak: number;

  @Column({ default: 0 })
  longestStreak: number;

  @Column({ type: 'date', nullable: true })
  lastVisitDate: Date;

  @Column({ default: 0 })
  freezesAvailable: number; // streak protection tokens

  @Column({ default: false })
  usedFreezeToday: boolean;

  @Column({ default: 0 })
  totalVisits: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
