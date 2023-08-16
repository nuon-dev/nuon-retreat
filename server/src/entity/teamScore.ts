import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  teamName: string

  @OneToMany(() => TeamScoreData, (scoreData) => scoreData.teamScore)
  teamScore: TeamScoreData[]
}

@Entity()
export class TeamScoreData {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  gameNumber: number

  @Column()
  score: number

  @ManyToOne(() => Team, (teamScore) => teamScore.teamScore)
  teamScore: Team
}
