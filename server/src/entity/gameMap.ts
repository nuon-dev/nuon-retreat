import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class GameMap {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  teamNumber: number

  @Column()
  country: string
}
