import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Game1 {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  user: number

  @Column()
  seatClass: string

  @Column()
  position: number
}
