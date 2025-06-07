import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { WorshipSchedule } from "./worshipSchedule"
import { User } from "./user"

@Entity()
export class AttendData {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => WorshipSchedule, (worshipSchedule) => worshipSchedule.id)
  worshipSchedule: WorshipSchedule

  @ManyToOne(() => User, (user) => user.id)
  user: User

  @Column()
  isAttend: boolean

  @Column()
  memo: string
}
