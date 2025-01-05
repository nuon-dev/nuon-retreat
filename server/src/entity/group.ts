import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "./user"

export enum GroupType {
  DARAKBANG = "DARAKBANG",
  VILLAGE = "VILLAGE",
}

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  parentId: number

  @Column()
  name: string

  @Column()
  description: string

  @Column({ default: "DARAKBANG" })
  groupType: GroupType

  @OneToMany(() => Group, (group) => group.parentId)
  users: User[]

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

  @Column()
  x: number

  @Column()
  y: number
}
