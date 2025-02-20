import { DataSource } from "typeorm"
import { InOutInfo } from "../entity/inOutInfo"
import { Permission } from "../entity/permission"
import { RetreatAttend } from "../entity/retreatAttend"
import { User } from "../entity/user"
import { Community } from "../entity/community"
import { ChatLog } from "../entity/chatLog"
import { SharingImage, SharingText, SharingVideo } from "../entity/sharing"

const dataSource = new DataSource(require("../../ormconfig.json"))

export const userDatabase = dataSource.getRepository(User)
export const chatLogDatabase = dataSource.getRepository(ChatLog)
export const communityDatabase = dataSource.getRepository(Community)
export const inOutInfoDatabase = dataSource.getRepository(InOutInfo)
export const permissionDatabase = dataSource.getRepository(Permission)
export const retreatAttendDatabase = dataSource.getRepository(RetreatAttend)

export const sharingTextDatabase = dataSource.getRepository(SharingText)
export const sharingImageDatabase = dataSource.getRepository(SharingImage)
export const sharingVideoDatabase = dataSource.getRepository(SharingVideo)

export default dataSource
