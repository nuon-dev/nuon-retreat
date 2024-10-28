import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm"
import { User } from "./user"

@Entity()
export class JoyfulJourneyManage {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => User)
  @JoinColumn()
  user: User

  @Column()
  lookForwardTo: number

  @Column()
  itForSure: number
}
