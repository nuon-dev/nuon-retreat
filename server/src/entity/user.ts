import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
} from "typeorm"
import { Permission } from "./permission"
import { Community } from "./community"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  kakaoId: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  yearOfBirth: number

  @Column({ nullable: true })
  gender: "man" | "woman"

  @Column({ nullable: true })
  phone: string

  @Column({
    nullable: true,
  })
  etc?: string

  @Column({ nullable: true })
  token: string

  @Column({ nullable: true })
  expire: Date

  @Column({ nullable: true, default: 0 })
  isSuperUser: boolean

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createAt: Date

  @OneToMany(() => Permission, (permission) => permission.user)
  permissions: Permission[]

  @ManyToOne(() => Community, (community) => community.users)
  community: Community | null
}
