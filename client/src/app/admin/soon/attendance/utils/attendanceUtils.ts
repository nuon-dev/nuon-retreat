import { User } from "@server/entity/user"
import { AttendData } from "@server/entity/attendData"
import { AttendStatus } from "@server/entity/types"

export function sortByCommunityId(a: User, b: User): number {
  if (a.community?.id !== b.community?.id) {
    return (a.community?.id || 0) - (b.community?.id || 0)
  }
  if (a.community?.leader?.id === a.id) {
    return -2 // a is leader, comes first
  }
  if (b.community?.leader?.id === b.id) {
    return 2 // b is leader, comes first
  }
  if (a.community?.deputyLeader?.id === a.id) {
    return -1 // a is deputy leader, comes before b
  }
  if (b.community?.deputyLeader?.id === b.id) {
    return 1 // b is deputy leader, comes before a
  }
  return a.name.localeCompare(b.name)
}

export function getAttendUserCount(
  attendDataList: AttendData[],
  worshipScheduleId: number
): { count: number; attend: number } {
  return attendDataList.reduce(
    (count, data) =>
      data.worshipSchedule.id === worshipScheduleId
        ? data.isAttend === AttendStatus.ATTEND
          ? {
              count: count.count + 1,
              attend: count.attend + 1,
            }
          : {
              count: count.count + 1,
              attend: count.attend,
            }
        : count,
    { count: 0, attend: 0 }
  )
}