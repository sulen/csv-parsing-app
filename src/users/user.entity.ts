import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Team } from '../teams/team.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({
    nullable: true,
  })
  lastName: string | null;

  @Column()
  @Index({ unique: true })
  email: string;

  @ManyToOne(() => Team, (team) => team.users, { nullable: true })
  team: Team;
}
