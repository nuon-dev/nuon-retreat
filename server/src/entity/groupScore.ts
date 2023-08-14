import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  groupName: string

  @OneToMany(() => GroupScoreData, (scoreData) => scoreData.groupScore)
  groupScore: GroupScoreData[]
}

@Entity()
export class GroupScoreData {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  gameNumber: number

  @Column()
  score: number

  @ManyToOne(() => Group, (groupScore) => groupScore.groupScore)
  groupScore: Group
}
