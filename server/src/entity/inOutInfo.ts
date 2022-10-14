import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

export enum InOutType {
    IN,
    OUT,
}

@Entity()
export class InOutInfo {
    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(() => User, (user) => user.id)
    useyKey

    @Column()
    time: string

    @Column()
    inOutType: InOutType
}