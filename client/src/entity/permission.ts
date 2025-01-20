import { PermissionType } from "./types"
import { User } from "@server/entity/user"

export class Permission {
  id: number
  user: User
  permissionType: PermissionType
  have: boolean
}
