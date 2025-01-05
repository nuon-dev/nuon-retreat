import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm"
import { Permission } from "./permission"
import { Group } from "./group"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  kakaoId: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  yearOfBirth: number

  @Column({ nullable: true })
  gender: string

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

  @Column({ nullable: true })
  darak: string

  @Column({ nullable: true, default: 0 })
  isSuperUser: boolean

  @Column()
  createAt: Date

  @OneToMany(() => Permission, (permission) => permission.user)
  permissions: Permission[]

  @ManyToOne(() => Group, (group) => group.users)
  groups: Group
}
