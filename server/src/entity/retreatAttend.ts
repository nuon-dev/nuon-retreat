import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { User } from "./user"
import { InOutInfo } from "./inOutInfo"

@Entity()
export class RetreatAttend {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => User, (user) => user.id)
  user: User

  @Column()
  communityNumber: number

  @Column()
  roomNumber: number

  @Column({ type: "text", nullable: true })
  memo: string

  @OneToMany(() => InOutInfo, (inOutInfo) => inOutInfo.retreatAttend)
  inOutInfo: InOutInfo[]
}
