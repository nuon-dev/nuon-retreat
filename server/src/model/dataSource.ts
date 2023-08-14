import { DataSource } from "typeorm"
import { GroupAssignment } from "../entity/groupAssignment"
import { InOutInfo } from "../entity/inOutInfo"
import { Permission } from "../entity/permission"
import { RoomAssignment } from "../entity/roomAssignment"
import { User } from "../entity/user"
import { Group, GroupScoreData } from "../entity/groupScore"

const dataSource = new DataSource(require("../../ormconfig.json"))

export const userDatabase = dataSource.getRepository(User)
export const attendInfoDatabase = dataSource.getRepository(InOutInfo)
export const permissionDatabase = dataSource.getRepository(Permission)
export const groupScoreDatabase = dataSource.getRepository(Group)
export const groupScoreDataDatabase = dataSource.getRepository(GroupScoreData)
export const roomAssignmentDatabase = dataSource.getRepository(RoomAssignment)
export const groupAssignmentDatabase = dataSource.getRepository(GroupAssignment)
export default dataSource
