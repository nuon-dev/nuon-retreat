import { DataSource } from "typeorm"
import { InOutInfo } from "../entity/inOutInfo"
import { Permission } from "../entity/permission"
import { RetreatAttend } from "../entity/retreatAttend"
import { User } from "../entity/user"
import { Group } from "../entity/group"

const dataSource = new DataSource(require("../../ormconfig.json"))

export const userDatabase = dataSource.getRepository(User)
export const groupDatabase = dataSource.getRepository(Group)
export const inOutInfoDatabase = dataSource.getRepository(InOutInfo)
export const permissionDatabase = dataSource.getRepository(Permission)
export const retreatAttendDatabase = dataSource.getRepository(RetreatAttend)

export default dataSource
