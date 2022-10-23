import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

export enum PermissionType{
    superUser,
    admin,
    userList,
    resetPassword,
    carpooling,
}

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.id)
    userId

    @Column()
    permissionTyle: PermissionType

    @Column()
    have: boolean
}