import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, TreeChildren, TreeParent } from "typeorm";
import { Days, InOutType, MoveType } from "./types";
import { User } from "./user";


@Entity()
export class InOutInfo {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.id)
    user: User

    @Column()
    day: Days

    @Column()
    time: string

    @Column()
    inOutType: InOutType

    @Column()
    position: string

    @Column()
    howToMove: MoveType

    @ManyToOne(() => InOutInfo, inOutInfo => inOutInfo.userInTheCar)
    rideCarInfo: InOutInfo | null

    @OneToMany(() => InOutInfo, inOutInfo => inOutInfo.rideCarInfo)
    userInTheCar: InOutInfo[]
}