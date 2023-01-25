import { GroupAssignment } from "./groupAssignment"
import { InOutInfo } from "./inOutInfo"
import { Permission } from "./permission"
import { RoomAssignment } from "./roomAssignment"
import { AttendType } from "./types"

export class User {
    id: number
    name: string
    password: string
    age: number
    sex: string
    phone: string
    attendType: AttendType
    etc?: string
    firstCome: boolean
    deposit: boolean
    token: string
    expire: Date
    isSuperUser: boolean
    createAt: Date
    permissions: Permission[]
    inOutInfos: InOutInfo[]
    roomAssignment: RoomAssignment
    groupAssignment: GroupAssignment
}