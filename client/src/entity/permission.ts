import { PermissionType } from "./types";
import { User } from "./user";


export class Permission {
    id: number
    user: User
    permissionType: PermissionType
    have: boolean
}