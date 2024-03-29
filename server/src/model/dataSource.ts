import { DataSource } from "typeorm"
import { GroupAssignment } from "../entity/groupAssignment"
import { InOutInfo } from "../entity/inOutInfo"
import { Permission } from "../entity/permission"
import { RoomAssignment } from "../entity/roomAssignment"
import { User } from "../entity/user"
import { Team, TeamScoreData } from "../entity/teamScore"
import { Game1 } from "../entity/game1"
import { Game2 } from "../entity/game2"
import { GameMap } from "../entity/gameMap"

const dataSource = new DataSource(require("../../ormconfig.json"))

export const userDatabase = dataSource.getRepository(User)
export const game1Database = dataSource.getRepository(Game1)
export const game2Database = dataSource.getRepository(Game2)
export const gameMapDatabase = dataSource.getRepository(GameMap)
export const teamScoreDatabase = dataSource.getRepository(Team)
export const attendInfoDatabase = dataSource.getRepository(InOutInfo)
export const permissionDatabase = dataSource.getRepository(Permission)
export const teamScoreDataDatabase = dataSource.getRepository(TeamScoreData)
export const roomAssignmentDatabase = dataSource.getRepository(RoomAssignment)
export const groupAssignmentDatabase = dataSource.getRepository(GroupAssignment)

export default dataSource
