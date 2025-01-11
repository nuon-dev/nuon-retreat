import { HowToMove } from "@server/entity/types"
import { GroupAssignment } from "./groupAssignment"
import { InOutInfo } from "./inOutInfo"
import { Permission } from "./permission"
import { RoomAssignment } from "./roomAssignment"
import { CurrentStatus, MoveType } from "./types"

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
  currentStatus: CurrentStatus
  isSuperUser: boolean
  createAt: Date
  permissions: Permission[]
  inOutInfos: InOutInfo[]
  roomAssignment: RoomAssignment
  howToLeave: HowToMove
  groupAssignment: GroupAssignment
  isCancell: boolean
  howToGo: HowToMove
  village: string
  darak: string
  isOutAtThursday: string
}
