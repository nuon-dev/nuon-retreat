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
  groupNumber: number

  @Column()
  roomNumber: number

  @OneToMany(() => InOutInfo, (inOutInfo) => inOutInfo.retreatAttend)
  inOutInfo: InOutInfo[]
}
