import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm"
import { GroupAssignment } from "./groupAssignment"
import { InOutInfo } from "./inOutInfo"
import { Permission } from "./permission"
import { RoomAssignment } from "./roomAssignment"
import { AttendType } from "./types"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    kakaoId: string

    @Column({nullable: true})
    name: string

    @Column({nullable: true})
    age: number

    @Column({nullable: true})
    sex: string

    @Column({nullable: true})
    phone: string

    @Column({nullable: true})
    attendType: AttendType

    @Column({
        nullable: true,
    })
    etc?: string

    @Column({nullable: true})
    firstCome: boolean

    @Column({nullable: true})
    deposit: boolean

    @Column({nullable: true})
    token: string

    @Column({nullable: true})
    expire: Date

    @Column({nullable: true})
    isCancell: boolean

    @Column({
        nullable: true
    })
    howToGo: string

    @Column({nullable: true})
    isSuperUser: boolean

    @Column()
    createAt: Date

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