import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Game2 {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  teamNumber: number

  @Column()
  currentPositionX: number

  @Column()
  currentPositionY: number

  @Column()
  lastPositionX: number

  @Column()
  lastPositionY: number

  @Column()
  moveCount: number
}
