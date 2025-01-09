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

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Group, (group) => group.children, { nullable: true })
  parent: Group | null

  @OneToMany(() => Group, (group) => group.parent)
  children: Group[]

  @Column()
  name: string

  @OneToMany(() => User, (user) => user.group)
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

  @Column({ default: 0 })
  x: number

  @Column({ default: 0 })
  y: number
}
