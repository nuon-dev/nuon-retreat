import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm"
import AttendType from './attendType'
import { InOutInfo } from "./inOutInfo"
import { Permission } from "./permission"
import { RoomAssignment } from "./roomAssignment"

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

    @Column()
    token: string

    @Column()
    expire: Date

    @Column()
    isSuperUser: boolean

    @OneToMany(() => Permission, (permission) => permission.user)
    permissions: Permission[]

    @OneToMany(() => InOutInfo, (inOutInfo) => inOutInfo.user)
    inOutInfos: InOutInfo[]

    @OneToOne(() => RoomAssignment)
    @JoinColumn()
    roomAssignment: RoomAssignment
}