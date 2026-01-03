import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('profiles')
@Index(['userId', 'type'])
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: ['main', 'partner', 'child', 'friend', 'crush', 'celebrity'],
  })
  type: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'date' })
  birthDate: string;

  @Column({ nullable: true })
  birthTime: string;

  @Column({ nullable: true })
  birthPlace: string;

  @Column()
  sunSign: string;

  @Column({ nullable: true })
  moonSign: string;

  @Column({ nullable: true })
  ascendant: string;

  @Column('simple-array')
  traits: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
