import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

export enum WorshipKind {
  SundayService = 1,
}

@Entity()
export class WorshipSchedule {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "int", nullable: false })
  kind: WorshipKind

  @Column()
  date: string

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: string

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  lastModifiedAt: string
}
