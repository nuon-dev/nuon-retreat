import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { Days, InOutType, HowToMove } from "./types"
import { RetreatAttend } from "./retreatAttend"

@Entity()
export class InOutInfo {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => RetreatAttend, (retreatAttend) => retreatAttend.inOutInfo)
  retreatAttend: RetreatAttend

  @Column({})
  day: Days

  @Column()
  time: number

  @Column()
  inOutType: InOutType

  @Column()
  position: string

  @Column()
  howToMove: HowToMove

  @ManyToOne(() => InOutInfo, (inOutInfo) => inOutInfo.userInTheCar)
  rideCarInfo: InOutInfo | null

  @OneToMany(() => InOutInfo, (inOutInfo) => inOutInfo.rideCarInfo)
  userInTheCar: InOutInfo[]
}
