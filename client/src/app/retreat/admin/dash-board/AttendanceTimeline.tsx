import { Box, Paper, Typography, Chip } from "@mui/material"
import { InOutInfo } from "@server/entity/retreat/inOutInfo"
import { Days, InOutType } from "@server/entity/types"

interface AttendanceTimelineProps {
  infoList: InOutInfo[]
  attendeeStatus: Record<string, number>
}

export default function AttendanceTimeline({
  infoList,
  attendeeStatus
}: AttendanceTimelineProps) {
  function getInfoCount(condition: (info: InOutInfo) => boolean) {
    return infoList.filter(condition).length
  }

  function conditionFilter(
    info: InOutInfo,
    day: number,
    inOutType: InOutType
  ) {
    return info.day === day && info.inOutType === inOutType
  }

  const timeList = [12, 15, 20, 24]
  const dayNames = ["첫날", "둘째날", "셋째날"]

  // 각 날짜별 누적 참석자 계산
  const firstDayIn = getInfoCount((info) =>
    conditionFilter(info, Days.firstDay, InOutType.IN)
  )
  const firstDayOut = getInfoCount((info) =>
    conditionFilter(info, Days.firstDay, InOutType.OUT)
  )
  const firstDayResult = attendeeStatus.goTogether + firstDayIn - firstDayOut

  const secondDayIn = getInfoCount((info) =>
    conditionFilter(info, Days.secondDay, InOutType.IN)
  )
  const secondDayOut = getInfoCount((info) =>
    conditionFilter(info, Days.secondDay, InOutType.OUT)
  )
  const secondDayResult = firstDayResult + secondDayIn - secondDayOut

  const thirdDayIn = getInfoCount((info) =>
    conditionFilter(info, Days.thirdDay, InOutType.IN)
  )
  const thirdDayOut = getInfoCount((info) =>
    conditionFilter(info, Days.thirdDay, InOutType.OUT)
  )
  const thirdDayResult = secondDayResult + thirdDayIn - thirdDayOut

  const dayResults = [firstDayResult, secondDayResult, thirdDayResult]

  return (
    <Paper elevation={2} sx={{ p: 3, m: 1, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        시간별 참석자 현황
      </Typography>
      
      <Typography variant="body2" color="text.secondary" mb={3}>
        교회버스 + 이동 정보 기반 (카풀 및 자차 제외)
      </Typography>

      {[Days.firstDay, Days.secondDay].map((day, dayIndex) => (
        <Box key={day} mb={3}>
          <Typography variant="subtitle1" fontWeight="bold" mb={2} color="primary.main">
            {dayNames[dayIndex]}
          </Typography>
          
          <Box display="flex" flexWrap="wrap" gap={1}>
            {timeList.map((time) => {
              const inCount = getInfoCount(
                (info) =>
                  conditionFilter(info, day, InOutType.IN) &&
                  Number.parseInt(info.time.toString()) <= time
              )
              const outCount = getInfoCount(
                (info) =>
                  conditionFilter(info, day, InOutType.OUT) &&
                  Number.parseInt(info.time.toString()) <= time
              )
              
              const expectedCount = dayIndex === 0 
                ? attendeeStatus.goTogether + inCount - outCount
                : dayResults[0] + inCount - outCount

              return (
                <Chip
                  key={time}
                  label={`${time}시: ${expectedCount}명`}
                  variant="outlined"
                  color="primary"
                  sx={{ 
                    fontWeight: "bold",
                    minWidth: 100
                  }}
                />
              )
            })}
          </Box>
        </Box>
      ))}

      <Box mt={3} p={2} bgcolor="primary.light" borderRadius={1}>
        <Typography variant="subtitle1" fontWeight="bold" color="primary.contrastText">
          주일 아침 예상 참석자: {thirdDayResult}명
        </Typography>
      </Box>
    </Paper>
  )
}