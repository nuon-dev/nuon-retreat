import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ViewEntity,
  DataSource,
  ViewColumn,
} from "typeorm"
import { GroupAssignment } from "./groupAssignment"
import { InOutInfo } from "./inOutInfo"
import { Permission } from "./permission"
import { RoomAssignment } from "./roomAssignment"
import { CurrentStatus, HowToMove, MoveType } from "./types"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  kakaoId: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  age: number

  @Column({ nullable: true })
  sex: string

  @Column({ nullable: true })
  phone: string

  @Column({
    nullable: true,
  })
  etc?: string

  @Column({ nullable: true, default: 0 })
  deposit: boolean

  @Column({ nullable: true })
  token: string

  @Column({ nullable: true })
  expire: Date

  @Column({ nullable: true, default: 0 })
  isCancel: boolean

  @Column({
    nullable: true,
  })
  howToGo: HowToMove

  @Column({ nullable: true })
  village: string

  @Column({ nullable: true })
  darak: string

  @Column({ nullable: true, default: 0 })
  isSuperUser: boolean

  @Column({ nullable: true, default: 0 })
  isOutAtThursday: string

  @Column({ nullable: true, default: CurrentStatus.null })
  currentStatus: CurrentStatus

  @Column()
  createAt: Date

  @Column({ default: HowToMove.together })
  howToLeave: HowToMove

  @OneToMany(() => Permission, (permission) => permission.user)
  permissions: Permission[]

  @OneToMany(() => InOutInfo, (inOutInfo) => inOutInfo.user)
  inOutInfos: InOutInfo[]

  @OneToOne(() => RoomAssignment)
  @JoinColumn()
  roomAssignment: RoomAssignment

  @OneToOne(() => GroupAssignment)
  @JoinColumn()
  groupAssignment: GroupAssignment
}
