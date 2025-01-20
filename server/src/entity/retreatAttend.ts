import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { User } from "./user"
import { InOutInfo } from "./inOutInfo"
import { HowToMove } from "./types"

@Entity()
export class RetreatAttend {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => User, (user) => user.retreatAttend)
  @JoinColumn()
  user: User

  @Column({ nullable: true })
  groupNumber: number

  @Column({ nullable: true })
  roomNumber: number

  @Column({ type: "text", nullable: true })
  memo: string

  @Column({ default: false })
  isDeposited: boolean

  @Column({ nullable: true })
  howToGo: HowToMove

  @Column({ nullable: true })
  howToBack: HowToMove

  @Column({ default: true })
  isCanceled: boolean

  @OneToMany(() => InOutInfo, (inOutInfo) => inOutInfo.retreatAttend)
  inOutInfo: InOutInfo[]
}
