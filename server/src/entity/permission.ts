import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { PermissionType } from "./types"
import { User } from "./user"

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.permissions)
  user: User

  @Column()
  permissionType: PermissionType

  @Column()
  have: boolean
}
