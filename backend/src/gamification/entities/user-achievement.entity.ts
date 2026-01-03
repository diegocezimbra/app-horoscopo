import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Achievement } from './achievement.entity';

/**
 * UserAchievement tracks which achievements a user has unlocked
 * Junction table between users and achievements
 */
@Entity('user_achievements')
@Index(['userId', 'achievementId'], { unique: true })
export class UserAchievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column()
  achievementId: string;

  @ManyToOne(() => Achievement, { eager: true })
  @JoinColumn({ name: 'achievementId' })
  achievement: Achievement;

  @Column({ default: false })
  seen: boolean; // has user seen the unlock notification?

  @CreateDateColumn()
  unlockedAt: Date;
}
