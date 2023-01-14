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
    name: string

    @Column()
    password: string

    @Column()
    age: number

    @Column()
    sex: string

    @Column()
    phone: string

    @Column()
    attendType: AttendType

    @Column({
        nullable: true,
    })
    etc?: string

    @Column()
    token: string

    @Column()
    expire: Date

    @Column()
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