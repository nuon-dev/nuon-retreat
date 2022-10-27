import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

export enum PermissionType{
    superUser,
    admin,
    userList,
    resetPassword,
    carpooling,
    permisionManage,
}

@Entity()
export class Permission {
    constructor({user, permissionType, have}) {
        this.user = user
        this.permissionType = permissionType
        this.have = have
    }

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.permissions)
    user: User

    @Column()
    permissionType: PermissionType

    @Column()
    have: boolean
}