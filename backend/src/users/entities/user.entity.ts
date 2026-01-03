import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * User entity representing app users with their astrological profile
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 10 })
  gender: 'male' | 'female';

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ nullable: true })
  birthTime: string;

  @Column({ nullable: true })
  birthPlace: string;

  @Column({ type: 'simple-array', nullable: true })
  interests: string[];

  @Column({ type: 'jsonb', nullable: true })
  quizAnswers: Record<string, string>;

  @Column({ type: 'jsonb', nullable: true })
  natalChart: any;

  @Column({ type: 'varchar', length: 20, default: 'free' })
  subscriptionTier: 'free' | 'premium' | 'ultimate';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
