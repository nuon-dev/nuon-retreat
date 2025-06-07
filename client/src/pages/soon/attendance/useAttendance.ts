import { AttendData } from "@server/entity/attendData"
import { Community } from "@server/entity/community"
import { WorshipSchedule } from "@server/entity/worshipSchedule"
import { get } from "pages/api"
import { useEffect, useState } from "react"
import { atom, useRecoilState } from "recoil"

const groupInfoAtom = atom<Community | undefined>({
  key: "groupInfoAtom",
  default: undefined,
})
const worshipScheduleListAtom = atom<WorshipSchedule[]>({
  key: "worshipScheduleListAtom",
  default: [],
})
const selectedScheduleIdAtom = atom<number>({
  key: "selectedScheduleIdAtom",
  default: 0,
})
const soonAttendDataAtom = atom<AttendData[]>({
  key: "soonAttendDataAtom",
  default: [],
})

export default function useAttendance() {
  const [groupInfo, setGroupInfo] = useRecoilState(groupInfoAtom)
  const [worshipScheduleList, setWorshipScheduleList] = useRecoilState(
    worshipScheduleListAtom
  )
  const [selectedScheduleId, setSelectedScheduleId] = useRecoilState(
    selectedScheduleIdAtom
  )
  const [soonAttendData, setSoonAttendData] = useRecoilState(soonAttendDataAtom)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedScheduleId) {
      getAttendData(selectedScheduleId)
    }
  }, [selectedScheduleId])

  async function getAttendData(scheduleId: number) {
    const data: Array<AttendData> = await get(
      `/soon/attendance/?scheduleId=${scheduleId}`
    )
    groupInfo?.users.forEach((user) => {
      if (
        !data.find(
          (d) => d.user.id === user.id && d.worshipSchedule.id === scheduleId
        )
      ) {
        data.push({
          user: user,
          worshipSchedule: { id: scheduleId } as WorshipSchedule,
          isAttend: true,
        } as AttendData)
      }
    })
    setSoonAttendData(data)
  }

  async function fetchData() {
    const groupInfo = await get("/soon/my-group-info")
    setGroupInfo(groupInfo)
    const worshipScheduleList = await get("/soon/worship-schedule")
    setWorshipScheduleList(worshipScheduleList)
    if (worshipScheduleList.length > 0) {
      setSelectedScheduleId(worshipScheduleList[0].id as number)
    }
  }

  return {
    groupInfo,
    worshipScheduleList,
    selectedScheduleId,
    setSelectedScheduleId,
    soonAttendData,
    setSoonAttendData,
    getAttendData,
  }
}
