import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * XP history entry structure
 */
export interface XPEntry {
  amount: number;
  reason: string;
  timestamp: Date;
}

/**
 * UserXP entity tracks experience points and leveling
 * Users gain XP through various actions and level up
 */
@Entity('user_xp')
export class UserXP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true })
  userId: string;

  @Column({ default: 0 })
  totalXp: number;

  @Column({ default: 1 })
  level: number;

  @Column({ type: 'jsonb', default: [] })
  xpHistory: XPEntry[];

  @Column({ default: 0 })
  weeklyXp: number; // XP earned this week (resets Sunday)

  @Column({ default: 0 })
  monthlyXp: number; // XP earned this month (resets 1st)

  @Column({ type: 'date', nullable: true })
  lastWeekReset: Date;

  @Column({ type: 'date', nullable: true })
  lastMonthReset: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
