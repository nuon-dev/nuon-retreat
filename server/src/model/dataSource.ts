import { DataSource } from "typeorm";
import { InOutInfo } from "../entity/inOutInfo";
import { Permission } from "../entity/permission";
import { RoomAssignment } from "../entity/roomAssignment";
import { User } from "../entity/user";

const dataSource = new DataSource(require('../../ormconfig.json'))

export const userDatabase = dataSource.getRepository(User)
export const attendInfoDatabase = dataSource.getRepository(InOutInfo)
export const permissionDatabase = dataSource.getRepository(Permission)
export const rommAssignmentDatabase = dataSource.getRepository(RoomAssignment)
export default dataSource

