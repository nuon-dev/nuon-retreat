"use client"

import { User } from "@server/entity/user"
import useAttendance from "./useAttendance"
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material"

export default function AttendRow({ user }: { user: User }) {
  const { soonAttendData, setSoonAttendData } = useAttendance()
  const attendData = soonAttendData.find((data) => data.user.id === user.id)
  if (!attendData) return null

  const isAttend = attendData.isAttend

  function handleAttendChange(
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ) {
    const newAttendStatus = event.target.value === "true"
    if (!attendData) return
    const newAttendData = { ...attendData, isAttend: newAttendStatus }
    setSoonAttendData((prev) =>
      prev.map((data) =>
        data.user.id === attendData.user.id ? newAttendData : data
      )
    )
  }

  return (
    <Stack gap="8px" direction="row" alignItems="center">
      <Stack width="60px" alignItems="center" textAlign="center">
        {user.name} ({user.yearOfBirth})
      </Stack>
      <Box
        borderRadius="10px"
        width="10px"
        height="10px"
        bgcolor={attendData?.id ? "green" : "red"}
      />
      <Select
        size="small"
        value={isAttend.toString()}
        onChange={handleAttendChange}
      >
        <MenuItem value={"true"}>출석</MenuItem>
        <MenuItem value={"false"}>결석</MenuItem>
      </Select>
      {!isAttend && (
        <TextField
          placeholder="사유"
          value={attendData?.memo}
          size="small"
          onChange={(e) => {
            const newAttendData = { ...attendData, memo: e.target.value }
            setSoonAttendData((prev) =>
              prev.map((data) =>
                data.user.id === attendData.user.id ? newAttendData : data
              )
            )
          }}
        />
      )}
    </Stack>
  )
}
