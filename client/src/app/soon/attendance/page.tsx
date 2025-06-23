"use client"

import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material"
import { Community } from "@server/entity/community"
import { WorshipSchedule } from "@server/entity/worshipSchedule"
import Header from "@components/Header"
import { get, post } from "config/api"
import { useEffect, useState } from "react"
import { worshipKr } from "util/worship"
import { AttendData } from "@server/entity/attendData"
import { User } from "@server/entity/user"
import useAttendance from "./useAttendance"
import AttendRow from "./AttendRow"

export default function SoonAttendance() {
  const {
    selectedScheduleId,
    soonAttendData,
    getAttendData,
    setSelectedScheduleId,
    worshipScheduleList,
    groupInfo,
  } = useAttendance()

  async function saveAttendData() {
    await post("/soon/attendance", {
      scheduleId: selectedScheduleId,
      attendData: soonAttendData,
    })
    if (selectedScheduleId) {
      getAttendData(selectedScheduleId)
    }
  }

  return (
    <Stack>
      <Header />
      <Stack p="12px" gap="24px">
        <Select
          value={selectedScheduleId}
          onChange={(e) => {
            setSelectedScheduleId(e.target.value as number)
          }}
        >
          {worshipScheduleList.map((schedule) => (
            <MenuItem key={schedule.id} value={schedule.id}>
              {schedule.date} - {worshipKr(schedule.kind)}
            </MenuItem>
          ))}
        </Select>
        <Stack>{groupInfo?.name} 다락방</Stack>
        <Stack gap="12px">
          {groupInfo?.users.map((user) => (
            <AttendRow key={user.id} user={user} />
          ))}
        </Stack>
        <Button variant="outlined" onClick={saveAttendData}>
          저장
        </Button>
      </Stack>
    </Stack>
  )
}
