import { MenuItem, Select, Stack, Typography, FormControl } from "@mui/material"
import { WorshipKind } from "@server/entity/worshipSchedule"
import { worshipKr } from "@/util/worship"
import FilterListIcon from "@mui/icons-material/FilterList"

interface AttendanceFilterProps {
  worshipScheduleFilter: WorshipKind | "all"
  setWorshipScheduleFilter: (filter: WorshipKind | "all") => void
}

export default function AttendanceFilter({
  worshipScheduleFilter,
  setWorshipScheduleFilter,
}: AttendanceFilterProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <FilterListIcon sx={{ color: "#1976d2", fontSize: 20 }} />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: "fit-content" }}
      >
        예배:
      </Typography>
      <FormControl size="small" sx={{ minWidth: 120 }}>
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
      </FormControl>
    </Stack>
  )
}
