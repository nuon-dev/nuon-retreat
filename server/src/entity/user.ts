import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import AttendType from './attendType'
import { Permission } from "./permission"

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

    @OneToMany(() => Permission, (permission) => permission.user)
    permissions: Permission[]
}