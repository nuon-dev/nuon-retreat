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

interface PermissionConstructor {
    user: User,
    permissionType: PermissionType,
    have: boolean
}

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.permissions)
    user: User

    @Column()
    permissionType: PermissionType

    @Column()
    have: boolean
}