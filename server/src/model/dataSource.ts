import { DataSource } from "typeorm"
import { GroupAssignment } from "../entity/groupAssignment"
import { InOutInfo } from "../entity/inOutInfo"
import { Permission } from "../entity/permission"
import { RoomAssignment } from "../entity/roomAssignment"
import { User } from "../entity/user"
import { Team, TeamScoreData } from "../entity/teamScore"
import { ANewLaity } from "../entity/aNewLaity"

const dataSource = new DataSource(require("../../ormconfig.json"))

export const userDatabase = dataSource.getRepository(User)
export const teamScoreDatabase = dataSource.getRepository(Team)
export const aNewLaityDatabase = dataSource.getRepository(ANewLaity)
export const attendInfoDatabase = dataSource.getRepository(InOutInfo)
export const permissionDatabase = dataSource.getRepository(Permission)
export const teamScoreDataDatabase = dataSource.getRepository(TeamScoreData)
export const roomAssignmentDatabase = dataSource.getRepository(RoomAssignment)
export const groupAssignmentDatabase = dataSource.getRepository(GroupAssignment)
export default dataSource
