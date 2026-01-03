import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('celebrities')
@Index(['name'])
@Index(['sunSign'])
export class Celebrity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'date' })
  birthDate: string;

  @Column()
  sunSign: string;

  @Column('simple-array')
  traits: string[];

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  profession: string;

  @CreateDateColumn()
  createdAt: Date;
}
