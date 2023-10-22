import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

export enum GameType {
  축구,
  해머,
  농구,
  다트,
  레크레이션,
  두더지잡기,
}

@Entity()
export class HappyFestivalScore {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  gameType: GameType

  @Column()
  gender: string

  @Column()
  name: string

  @Column()
  score: number
}
