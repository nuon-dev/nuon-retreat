import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

enum WorshipKind {
  SundayService,
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
