import { Box, Stack } from "@mui/material"
import { useEffect, useRef, useState } from "react"

interface DayInfo {
  day: number
  dayOfWeek: string
}

interface OneDayPlan {
  day: string
  hour: number
  minute: number
  content: string
  progressTime: number
}

export default function Home() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [calendarHeight, setCalendarHeight] = useState(0)
  const topArea = useRef<HTMLElement>()

  useEffect(() => {
    calcHeight()
  }, [topArea])

  function calcHeight() {
    if (!topArea.current) return
    const leftHeight = window.innerHeight - topArea.current.clientHeight
    setCalendarHeight(leftHeight)
  }

  const days: DayInfo[] = [
    {
      day: 12,
      dayOfWeek: "Mon",
    },
    {
      day: 13,
      dayOfWeek: "Tue",
    },
    {
      day: 14,
      dayOfWeek: "Wed",
    },
    {
      day: 15,
      dayOfWeek: "Thu",
    },
    {
      day: 16,
      dayOfWeek: "Fri",
    },
    {
      day: 17,
      dayOfWeek: "Sat",
    },
    {
      day: 18,
      dayOfWeek: "Sun",
    },
  ]

  const data: OneDayPlan[] = [
    {
      day: "Mon",
      hour: 20,
      minute: 30,
      content: "월요\n기도회",
      progressTime: 75,
    },
  ]

  return (
    <Stack bgcolor="#1d321a">
      <Stack ref={topArea}>
        <Stack height="150px" gap="12px">
          <img
            width="100%"
            height="100%"
            style={{
              objectFit: "cover",
              borderBottomLeftRadius: "20px",
              borderBottomRightRadius: "20px",
            }}
            src="./bg_2.jpeg"
            alt=""
          />
        </Stack>
        <Stack
          height="100px"
          direction="row"
          justifyContent="space-around"
          gap="4px"
          p="20px 10px"
          m="0 10px"
          color="white"
        >
          {days.map((day, index) =>
            Day(day, selectedDay === index, () => {
              setSelectedDay(index)
            })
          )}
        </Stack>
      </Stack>
      <Stack pb="0">
        {HourPlan(
          calendarHeight,
          data.filter((d) => d.day === days[selectedDay].dayOfWeek)
        )}
      </Stack>
    </Stack>
  )
}

function HourPlan(height: number, data: OneDayPlan[]) {
  const hourPlanData: number[] = new Array(16).fill(0)
  return (
    <Stack px="30px" height={height - 60} overflow="auto">
      {hourPlanData.map((_, idx) => {
        const hour = idx + 9
        const toDayPlan = data.find((d) => d.hour === hour)
        return (
          <Stack
            height="40px"
            pb="20px"
            mb="20px"
            borderBottom="1px dashed #aaa"
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            fontWeight="600"
            color="white"
          >
            <Stack>{hour}:00</Stack>

            {toDayPlan && (
              <Stack
                px="10px"
                mr="10px"
                justifyContent="center"
                alignItems="center"
                borderRadius="12px"
                bgcolor={toDayPlan.content !== "" ? "#AC9173" : ""}
                color="white"
                whiteSpace="pre-wrap"
                textAlign="center"
                fontWeight="300"
                height={toDayPlan.progressTime + "px"}
                marginTop={
                  (toDayPlan.minute / 60) * 60 +
                  toDayPlan.progressTime / 2 +
                  "px"
                }
              >
                {toDayPlan.content}
              </Stack>
            )}
          </Stack>
        )
      })}
    </Stack>
  )
}

function Day(dayInfo: DayInfo, isSelected: boolean, onClick: () => void) {
  return (
    <Stack
      key={dayInfo.day}
      gap="4px"
      onClick={onClick}
      padding="8px"
      borderRadius="24px"
      className="day-select"
      style={{
        border: isSelected ? "1px solid black" : "1px solid #E8E1D0",
      }}
    >
      <Box
        textAlign="center"
        color={dayInfo.dayOfWeek === "Sun" ? "#A77265" : "#7A766c"}
        fontSize="12px"
      >
        {dayInfo.dayOfWeek}
      </Box>
      <Box textAlign="center" fontWeight="bold">
        {dayInfo.day}
      </Box>
    </Stack>
  )
}
