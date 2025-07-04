"use client"

import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material"
import AdminHeader from "@/components/AdminHeader"
import { useEffect, useState } from "react"
import { WorshipKind, WorshipSchedule } from "@server/entity/worshipSchedule"
import { dele, get, post, put } from "@/config/api"
import { useSetAtom } from "jotai"
import { NotificationMessage } from "@/state/notification"
import { worshipKr } from "@/util/worship"

export default function WorshipSchedulePage() {
  const setNotificationMessage = useSetAtom(NotificationMessage)
  const [worshipScheduleList, setWorshipScheduleList] = useState<
    WorshipSchedule[]
  >([])
  const [selectedWorship, setSelectedWorship] = useState<WorshipSchedule>({
    date: "",
    kind: WorshipKind.SundayService,
  } as WorshipSchedule)

  useEffect(() => {
    fetchWorshipSchedules()
  }, [])

  function editWorshipSchedule(key: keyof WorshipSchedule, value: any) {
    setSelectedWorship({
      ...selectedWorship,
      [key]: value,
    })
  }

  async function fetchWorshipSchedules() {
    const worshipScheduleList = await get("/admin/worship-schedule")
    setWorshipScheduleList(worshipScheduleList)
  }

  async function saveWorshipSchedule() {
    if (!selectedWorship.date || !selectedWorship.kind) {
      setNotificationMessage("날짜와 종류를 모두 입력해주세요.")
      return
    }
    if (selectedWorship.id) {
      await put("/admin/worship-schedule", selectedWorship)
    } else {
      await post("/admin/worship-schedule", selectedWorship)
    }
    setNotificationMessage("예배 일정이 저장되었습니다.")
    await fetchWorshipSchedules()
  }

  function resetSelectedWorship() {
    setSelectedWorship({
      date: "",
      kind: WorshipKind.SundayService,
    } as WorshipSchedule)
  }

  function deleteWorshipSchedule() {
    if (!selectedWorship.id) return
    dele(`/admin/worship-schedule/${selectedWorship.id}`, {})
    setNotificationMessage("예배 일정이 삭제되었습니다.")
    fetchWorshipSchedules()
  }

  return (
    <Stack>
      <AdminHeader />
      <Stack p="12px" gap="12px" direction="row">
        <Stack
          width="60%"
          border="1px solid #ccc"
          borderRadius="12px"
          minHeight="calc(100vh - 100px)"
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">날짜</TableCell>
                <TableCell align="center">종류</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {worshipScheduleList.map((schedule) => (
                <TableRow
                  key={schedule.id}
                  onClick={() => setSelectedWorship(schedule)}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedWorship?.id === schedule.id
                        ? "#f0f0f0"
                        : "inherit",
                  }}
                >
                  <TableCell align="center">{schedule.date}</TableCell>
                  <TableCell align="center">
                    {worshipKr(schedule.kind)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Stack>
        <Stack width="40%">
          <Stack direction="row" justifyContent="space-between">
            <Button variant="outlined" onClick={resetSelectedWorship}>
              새로 추가하기
            </Button>
            {selectedWorship?.id && (
              <Button variant="outlined" onClick={deleteWorshipSchedule}>
                삭제
              </Button>
            )}
          </Stack>
          <Stack>
            <Stack
              p="12px"
              m="12px"
              gap="12px"
              border="1px solid #ccc"
              borderRadius="24px"
            >
              <Stack direction="row" gap="12px" alignItems="center">
                <Stack>
                  <Box width="50px">날짜</Box>
                </Stack>
                <TextField
                  fullWidth
                  type="date"
                  value={selectedWorship?.date}
                  onChange={(e) => {
                    editWorshipSchedule("date", e.target.value)
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
              <Stack direction="row" gap="12px" alignItems="center">
                <Box width="50px">종류</Box>
                <Select
                  fullWidth
                  value={selectedWorship?.kind}
                  onChange={(e) => {
                    editWorshipSchedule("kind", e.target.value)
                  }}
                >
                  <MenuItem value={WorshipKind.SundayService}>
                    {worshipKr(WorshipKind.SundayService)}
                  </MenuItem>
                  <MenuItem value={WorshipKind.FridayService}>
                    {worshipKr(WorshipKind.FridayService)}
                  </MenuItem>
                </Select>
              </Stack>
              <Stack direction="row" gap="12px" alignItems="center">
                <Box width="50px">수정 가능</Box>
                <Select
                  fullWidth
                  value={selectedWorship?.canEdit ? "true" : "false"}
                  onChange={(e) => {
                    editWorshipSchedule("canEdit", e.target.value === "true")
                  }}
                >
                  <MenuItem value="true">예</MenuItem>
                  <MenuItem value="false">아니오</MenuItem>
                </Select>
              </Stack>
              <Stack direction="row" gap="12px" alignItems="center">
                <Box width="50px">조회 여부</Box>
                <Select
                  fullWidth
                  value={selectedWorship?.isVisible ? "true" : "false"}
                  onChange={(e) => {
                    editWorshipSchedule("isVisible", e.target.value === "true")
                  }}
                >
                  <MenuItem value="true">예</MenuItem>
                  <MenuItem value="false">아니요</MenuItem>
                </Select>
              </Stack>
            </Stack>
            <Stack p="12px" alignItems="center">
              <Stack>
                <Button variant="outlined" onClick={saveWorshipSchedule}>
                  {selectedWorship?.id ? "수정하기" : "추가하기"}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
