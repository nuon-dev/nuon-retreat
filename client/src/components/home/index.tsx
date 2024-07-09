import { Box, Stack } from "@mui/material"
import { useEffect, useRef, useState } from "react"

interface DayInfo {
  day: number
  dayOfWeek: string
}

interface OneDayPlan {
  day: string
  hour: number
  content: string
}

export default function Home() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [calandalHeight, setCalandalHeight] = useState(0)
  const topArea = useRef<HTMLElement>()

  useEffect(() => {
    calcHeight()
  }, [topArea])

  function calcHeight() {
    if (!topArea.current) return
    const leftHeight = window.innerHeight - topArea.current.clientHeight
    setCalandalHeight(leftHeight)
  }

  const days: DayInfo[] = [
    {
      day: 11,
      dayOfWeek: "Sun",
    },
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
  ]

  const data: OneDayPlan[] = [
    { day: "sun", hour: 9, content: "" },
    { day: "sun", hour: 10, content: "" },
    { day: "sun", hour: 11, content: "수련회 신청 시작" },
    { day: "sun", hour: 12, content: "" },
    { day: "sun", hour: 13, content: "" },
    { day: "sun", hour: 14, content: "" },
    { day: "sun", hour: 15, content: "" },
    { day: "sun", hour: 16, content: "" },
    { day: "sun", hour: 17, content: "" },
    { day: "sun", hour: 18, content: "" },
    { day: "sun", hour: 19, content: "" },
    { day: "sun", hour: 20, content: "" },
    { day: "sun", hour: 21, content: "" },
    { day: "sun", hour: 22, content: "" },
    { day: "sun", hour: 23, content: "" },
    { day: "sun", hour: 24, content: "" },
  ]

  return (
    <Stack bgcolor="#E8E1D0">
      <Stack ref={topArea}>
        <Stack height="200px" gap="12px">
          <img
            width="100%"
            height="100%"
            style={{
              objectFit: "cover",
              borderBottomLeftRadius: "20px",
              borderBottomRightRadius: "20px",
            }}
            src="./bg_2.webp"
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
        >
          {days.map((day, index) =>
            Day(day, selectedDay === index, () => {
              setSelectedDay(index)
            })
          )}
        </Stack>
      </Stack>
      <Stack px="30px" pb="0">
        {HourPlan(
          calandalHeight,
          data.filter(
            (d) => d.day === days[selectedDay].dayOfWeek.toLocaleLowerCase()
          )
        )}
      </Stack>
    </Stack>
  )
}

function HourPlan(height: number, data: OneDayPlan[]) {
  const hourPlanData: number[] = new Array(16).fill(0)
  return (
    <Stack height={height - 60} overflow="auto">
      {hourPlanData.map((_, idx) => {
        const toDayPlan = data[idx]
        const hour = idx + 9
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
          >
            <Stack>{hour}:00</Stack>

            {toDayPlan && (
              <Stack
                p="7px 10px"
                borderRadius="30px"
                bgcolor={toDayPlan.content !== "" ? "#AC9173" : ""}
                color="white"
                fontWeight="300"
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

function TodayPlan(day: number) {
  switch (day) {
    case 0:
      return (
        <Stack>
          <Box>주일의 일정</Box>
        </Stack>
      )
    case 1:
      return (
        <Stack>
          <Box>월요일 일정</Box>
        </Stack>
      )
    case 2:
      return (
        <Stack>
          <Box>화요일 일정1</Box>
        </Stack>
      )
    case 3:
      return (
        <Stack>
          <Box>수요일 일정1</Box>
        </Stack>
      )
    case 4:
      return (
        <Stack>
          <Box>목요일 일정1</Box>
        </Stack>
      )
    case 5:
      return (
        <Stack>
          <Box>금요일 일정1</Box>
        </Stack>
      )

    case 6:
      return (
        <Stack>
          <Box>토요일 일정1</Box>
        </Stack>
      )
  }
  return null
}

function Day(dayInfo: DayInfo, isSelected: boolean, onClick: () => void) {
  return (
    <Stack
      key={dayInfo.day}
      gap="4px"
      onClick={onClick}
      padding="8px"
      borderRadius="24px"
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
