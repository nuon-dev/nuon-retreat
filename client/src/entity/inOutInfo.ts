import { Days, InOutType, MoveType } from "./types";
import { User } from "./user";


export class InOutInfo {
    id: number
    user: User
    day: Days
    time: string
    inOutType: InOutType
    position: string
    howToMove: MoveType
    rideCarInfo: InOutInfo
    userInTheCar: InOutInfo[]
}