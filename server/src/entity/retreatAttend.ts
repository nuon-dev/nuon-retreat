import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { User } from "./user"
import { InOutInfo } from "./inOutInfo"
import { CurrentStatus, Deposit, HowToMove } from "./types"

@Entity()
export class RetreatAttend {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => User, (user) => user.retreatAttend)
  @JoinColumn()
  user: User

  @Column({ default: 0 })
  groupNumber: number

  @Column({ nullable: true })
  roomNumber: number

  @Column({ type: "text", nullable: true })
  memo: string

  @Column({ default: Deposit.none })
  isDeposited: Deposit

  @Column({ nullable: true })
  howToGo: HowToMove

  @Column({ nullable: true })
  howToBack: HowToMove

  @Column({ default: true })
  isCanceled: boolean

  @Column({ nullable: true })
  etc: string

  @Column({ default: CurrentStatus.null })
  currentStatus: CurrentStatus

  @Column({ default: 0 })
  attendanceNumber: number

  @OneToMany(() => InOutInfo, (inOutInfo) => inOutInfo.retreatAttend)
  inOutInfos: InOutInfo[]

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createAt: Date
}
