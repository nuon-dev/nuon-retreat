import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GroupAssignment {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        default: 0
    })
    roomNumber: number
}