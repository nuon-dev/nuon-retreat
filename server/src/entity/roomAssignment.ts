import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class RoomAssignment {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    default: 0,
  })
  roomNumber: number

  @Column({
    default: true,
  })
  isUpdated: boolean
}
