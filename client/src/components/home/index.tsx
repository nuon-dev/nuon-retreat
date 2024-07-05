import { Box, Stack } from "@mui/material"
import { MouseEvent, MouseEventHandler, useState } from "react"
import Edit from "./edit"

interface DayInfo {
  day: number
  dayOfWeek: string
}

export default function Home() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [showEditPage, setShowEditPage] = useState(false)

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

  return (
    <Stack>
      <Stack
        padding="20px"
        gap="12px"
        borderBottom="1px solid #ddd"
        borderRadius="20px"
      >
        <Box fontSize="30px">What's on</Box>
        <Box width="100%" height="0.1px" bgcolor="#ccc" />
        <Box fontSize="20px" textAlign="center" margin="16px" fontWeight="bold">
          2024. 08
        </Box>
        <Stack direction="row" justifyContent="space-around" gap="4px">
          {days.map((day, index) =>
            Day(day, selectedDay === index, () => {
              setSelectedDay(index)
            })
          )}
        </Stack>
      </Stack>
      <Stack p="20px">{TodayPlan(selectedDay)}</Stack>
      {AddButton(() => setShowEditPage(true))}
      {showEditPage && <Edit onClose={() => setShowEditPage(false)} />}
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

function AddButton(
  onClick: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void
) {
  return (
    <Stack
      onClick={onClick}
      width="40px"
      height="40px"
      justifyContent="center"
      alignSelf="center"
      alignItems="center"
      borderRadius="40px"
      position="fixed"
      bottom="40px"
      zIndex="10"
      bgcolor="orange"
      color="white"
      fontSize="24px"
    >
      +
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
      style={{
        border: isSelected ? "1px solid black" : "1px solid white",
      }}
    >
      <Box
        textAlign="center"
        color={dayInfo.dayOfWeek === "Sun" ? "red" : "#ccc"}
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
