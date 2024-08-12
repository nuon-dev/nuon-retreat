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
    {
      day: "Tue",
      hour: 20,
      minute: 30,
      content: "화요\n기도회",
      progressTime: 75,
    },
    {
      day: "Thu",
      hour: 10,
      minute: 30,
      content: "교회 집합",
      progressTime: 30,
    },
    {
      day: "Thu",
      hour: 12,
      minute: 0,
      content: "점심",
      progressTime: 60,
    },
    {
      day: "Thu",
      hour: 14,
      minute: 0,
      content: "애니어그램",
      progressTime: 120,
    },
    {
      day: "Thu",
      hour: 17,
      minute: 0,
      content: "저녁",
      progressTime: 60,
    },
    {
      day: "Thu",
      hour: 18,
      minute: 30,
      content: "저녁 집회",
      progressTime: 240,
    },
    {
      day: "Fri",
      hour: 8,
      minute: 0,
      content: "아침",
      progressTime: 60,
    },
    {
      day: "Fri",
      hour: 9,
      minute: 0,
      content: "세미나",
      progressTime: 150,
    },
    {
      day: "Fri",
      hour: 12,
      minute: 0,
      content: "점심",
      progressTime: 60,
    },
    {
      day: "Fri",
      hour: 14,
      minute: 0,
      content: "오후\n프로그램",
      progressTime: 240,
    },
    {
      day: "Fri",
      hour: 18,
      minute: 0,
      content: "저녁",
      progressTime: 90,
    },
    {
      day: "Fri",
      hour: 20,
      minute: 30,
      content: "저녁 집회",
      progressTime: 240,
    },
    {
      day: "Sat",
      hour: 8,
      minute: 0,
      content: "아침",
      progressTime: 60,
    },
    {
      day: "Sat",
      hour: 9,
      minute: 0,
      content: "세미나",
      progressTime: 150,
    },
    {
      day: "Sat",
      hour: 12,
      minute: 0,
      content: "점심",
      progressTime: 60,
    },
    {
      day: "Sat",
      hour: 14,
      minute: 0,
      content: "오후\n프로그램",
      progressTime: 240,
    },
    {
      day: "Sat",
      hour: 18,
      minute: 0,
      content: "저녁",
      progressTime: 90,
    },
    {
      day: "Sat",
      hour: 20,
      minute: 30,
      content: "저녁 집회",
      progressTime: 240,
    },
    {
      day: "Sun",
      hour: 10,
      minute: 0,
      content: "오전\n프로그램",
      progressTime: 60,
    },
    {
      day: "Sun",
      hour: 11,
      minute: 0,
      content: "점심",
      progressTime: 60,
    },
    {
      day: "Sun",
      hour: 12,
      minute: 0,
      content: "교회로 이동",
      progressTime: 120,
    },
    {
      day: "Sun",
      hour: 14,
      minute: 0,
      content: "청년부 예배",
      progressTime: 120,
    },
  ]

  return (
    <Stack bgcolor="#1d321a" pb="60px">
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
      <Stack mb="20px">
        {HourPlan(
          calendarHeight,
          data.filter((d) => d.day === days[selectedDay].dayOfWeek)
        )}
      </Stack>
    </Stack>
  )
}

function HourPlan(height: number, data: OneDayPlan[]) {
  const hourPlanData: number[] = new Array(17).fill(0)
  const gap = 10
  return (
    <Stack px="30px" height={height - 60} overflow="auto">
      {hourPlanData.map((_, idx) => {
        const hour = idx + 8
        const toDayPlan = data.find((d) => d.hour === hour)
        return (
          <Stack
            minHeight="60px"
            direction="row"
            borderBottom="1px dashed #aaa"
            justifyContent="space-between"
            alignItems="start"
            fontWeight="600"
            color="white"
          >
            <Stack height="100%" justifyContent="center">
              {hour}:00
            </Stack>
            {toDayPlan && (
              <Stack
                px="10px"
                mr="40px"
                width="100px"
                justifyContent="center"
                alignItems="center"
                borderRadius="12px"
                bgcolor="white"
                color="#1d321a"
                whiteSpace="pre-wrap"
                textAlign="center"
                fontWeight="300"
                height={toDayPlan.progressTime - gap + "px"}
                marginTop={toDayPlan.minute + gap / 2 + "px"}
                zIndex="20"
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
