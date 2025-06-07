import { DataSource } from "typeorm"
import { InOutInfo } from "../entity/retreat/inOutInfo"
import { Permission } from "../entity/permission"
import { RetreatAttend } from "../entity/retreat/retreatAttend"
import { User } from "../entity/user"
import { Community } from "../entity/community"
import { ChatLog } from "../entity/retreat/chatLog"
import {
  SharingImage,
  SharingText,
  SharingVideo,
} from "../entity/retreat/sharing"
import { WorshipSchedule } from "../entity/worshipSchedule"
import { AttendData } from "../entity/attendData"

const dataSource = new DataSource(require("../../ormconfig.json"))

export const userDatabase = dataSource.getRepository(User)
export const communityDatabase = dataSource.getRepository(Community)
export const permissionDatabase = dataSource.getRepository(Permission)
export const attendDataDatabase = dataSource.getRepository(AttendData)
export const worshipScheduleDatabase = dataSource.getRepository(WorshipSchedule)

export const chatLogDatabase = dataSource.getRepository(ChatLog)
export const inOutInfoDatabase = dataSource.getRepository(InOutInfo)
export const retreatAttendDatabase = dataSource.getRepository(RetreatAttend)

export const sharingTextDatabase = dataSource.getRepository(SharingText)
export const sharingImageDatabase = dataSource.getRepository(SharingImage)
export const sharingVideoDatabase = dataSource.getRepository(SharingVideo)

export default dataSource
