import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import MoveType from "./moveType";
import { User } from "./user";

export enum InOutType {
    IN = 'in',
    OUT = 'out',
}

@Entity()
export class InOutInfo {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.id)
    user: User

    @Column()
    time: string

    @Column()
    inOutType: InOutType

    @Column()
    position: string

    @Column()
    howToMove: MoveType

}