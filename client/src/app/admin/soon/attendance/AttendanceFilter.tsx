import { MenuItem, Select, Stack } from "@mui/material"
import { WorshipKind } from "@server/entity/worshipSchedule"
import { worshipKr } from "@/util/worship"

interface AttendanceFilterProps {
  worshipScheduleFilter: WorshipKind | "all"
  setWorshipScheduleFilter: (filter: WorshipKind | "all") => void
}

export default function AttendanceFilter({
  worshipScheduleFilter,
  setWorshipScheduleFilter
}: AttendanceFilterProps) {
  return (
    <Stack
      gap="16px"
      margin="4px"
      padding="8px"
      direction="row"
      alignItems="center"
    >
      조회할 예배 종류:
      <Select
        value={worshipScheduleFilter}
        onChange={(e) =>
          setWorshipScheduleFilter(e.target.value as WorshipKind | "all")
        }
      >
        <MenuItem value="all">전체</MenuItem>
        <MenuItem value={WorshipKind.SundayService}>
          {worshipKr(WorshipKind.SundayService)}
        </MenuItem>
        <MenuItem value={WorshipKind.FridayService}>
          {worshipKr(WorshipKind.FridayService)}
        </MenuItem>
      </Select>
    </Stack>
  )
}