import { DataSource } from "typeorm"
import { GroupAssignment } from "../entity/groupAssignment"
import { InOutInfo } from "../entity/inOutInfo"
import { Permission } from "../entity/permission"
import { RoomAssignment } from "../entity/roomAssignment"
import { User } from "../entity/user"
import { GameMap } from "../entity/gameMap"

const dataSource = new DataSource(require("../../ormconfig.json"))

export const userDatabase = dataSource.getRepository(User)
export const gameMapDatabase = dataSource.getRepository(GameMap)
export const attendInfoDatabase = dataSource.getRepository(InOutInfo)
export const permissionDatabase = dataSource.getRepository(Permission)
export const roomAssignmentDatabase = dataSource.getRepository(RoomAssignment)
export const groupAssignmentDatabase = dataSource.getRepository(GroupAssignment)

export default dataSource
