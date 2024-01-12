import { GroupAssignment } from "./groupAssignment"
import { InOutInfo } from "./inOutInfo"
import { Permission } from "./permission"
import { RoomAssignment } from "./roomAssignment"
import { HowToMove, MoveType } from "./types"

export class User {
  id: number
  kakaoId: string
  name: string
  password: string
  age: number
  sex: "man" | "woman"
  phone: string
  etc?: string
  deposit: boolean
  token: string
  expire: Date
  isSuperUser: boolean
  createAt: Date
  permissions: Permission[]
  inOutInfos: InOutInfo[]
  roomAssignment: RoomAssignment
  howToLeave: HowToMove
  groupAssignment: GroupAssignment
  isCancell: boolean
  howToGo: HowToMove
  whenIn: string
}
