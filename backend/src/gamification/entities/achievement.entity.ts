import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

/**
 * Achievement entity defines all available achievements in the system
 * These are predefined achievements that users can unlock
 */
@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string; // unique identifier like 'first_reading', 'streak_7'

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  xpReward: number;

  @Column()
  icon: string;

  @Column({ nullable: true })
  category: string; // 'onboarding', 'streak', 'social', 'exploration', 'premium'

  @Column({ default: false })
  isSecret: boolean; // hidden achievements not shown until unlocked

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;
}
