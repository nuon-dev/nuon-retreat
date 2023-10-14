import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./user"

export enum status {
  worry,
  confirm,
}

@Entity()
export class ANewLaity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.id)
  user: User

  @Column()
  newMemberName: string

  @Column()
  status: status
}
