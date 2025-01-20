import { Days, InOutType, MoveType } from "./types"
import { User } from "@server/entity/user"

export class InOutInfo {
  id: number
  user: User
  day: Days
  time: number
  inOutType: InOutType
  position: string
  howToMove: MoveType
  rideCarInfo: InOutInfo | null
  userInTheCar: InOutInfo[]
}
