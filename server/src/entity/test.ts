import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class InOutInfo {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    time: string

    @Column()
    position: string
}