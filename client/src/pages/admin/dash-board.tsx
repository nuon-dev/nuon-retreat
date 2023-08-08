import { Box, Stack } from "@mui/material"
import { get } from "../../pages/api"
import { useEffect, useState } from "react"

function DashBoard() {
  const [getAttendeeStatus, setAttendeeStatus] = useState(
    {} as Record<string, number>
  )
  const [getAttendanceTimeList, setAttendaceTimeList] = useState([])
  const [getAgeInfoList, setAgeInfoList] = useState<Record<string, number>>([])
  const [windowSize, setWindowSize] = useState({} as Record<string, number>)

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
    fetchData()
    setInterval(fetchData, 1000 * 60 * 30)
  }, [])

  async function fetchData() {
    setAttendeeStatus(await get("/admin/get-attendee-status"))
    setAttendaceTimeList(await get("/admin/get-attendance-time"))
    setAgeInfoList(await get("/admin/get-age-info"))
  }

  function attendeeStatus() {
    const targetCount = 300
    return (
      <Stack>
        <Box
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <Stack
            fontSize="24px"
            style={{
              margin: "8px",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #ACACAC",
              boxShadow: "2px 2px 5px 3px #ACACAC;",
            }}
          >
            참석자 현황
          </Stack>
          <Stack
            margin="8px"
            fontSize="24px"
            style={{
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #ACACAC",
              boxShadow: "2px 2px 5px 3px #ACACAC;",
            }}
            display="flex"
            direction="row"
            justifyContent="center"
            alignContent="end"
          >
            <Box fontSize="12px" alignSelf="start" mr="8px" mt="2px">
              참가자수
            </Box>{" "}
            <Box fontSize="28px" alignSelf="end">
              {getAttendeeStatus.all}
            </Box>{" "}
            <Box pb="2px" pl="6px" alignSelf="end" fontSize="20px">
              {" "}
              / {targetCount}
            </Box>
          </Stack>
          <Stack
            margin="8px"
            fontSize="24px"
            style={{
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #ACACAC",
              boxShadow: "2px 2px 5px 3px #ACACAC;",
            }}
            direction="row"
          >
            <Box fontSize="12px" alignSelf="start" mr="8px" mt="2px">
              참석율
            </Box>
            <Box fontSize="28px" alignSelf="end">
              {((getAttendeeStatus.all / targetCount) * 100).toFixed(1)}
            </Box>{" "}
            <Box pb="2px" pl="3px" alignSelf="end" fontSize="20px">
              {" "}
              % {}
            </Box>
          </Stack>
          <Stack
            margin="8px"
            fontSize="24px"
            style={{
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #ACACAC",
              boxShadow: "2px 2px 5px 3px #ACACAC;",
            }}
            direction="row"
          >
            <Box fontSize="12px" alignSelf="start" mr="8px" mt="2px">
              남/여
            </Box>{" "}
            <Box color="lightblue">{getAttendeeStatus.man}</Box>{" "}
            <Box px="8px">/</Box>{" "}
            <Box color="pink">{getAttendeeStatus.woman}</Box>
          </Stack>
          <Stack
            margin="8px"
            fontSize="24px"
            style={{
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #ACACAC",
              boxShadow: "2px 2px 5px 3px #ACACAC;",
            }}
            direction="row"
          >
            <Box fontSize="12px" alignSelf="start" mr="8px" mt="2px">
              성비
            </Box>
            <Box color="lightblue">
              {((getAttendeeStatus.man / getAttendeeStatus.all) * 100).toFixed(
                1
              )}
            </Box>
            % <Box px="8px">/</Box>{" "}
            <Box color="pink">
              {(
                (getAttendeeStatus.woman / getAttendeeStatus.all) *
                100
              ).toFixed(1)}
            </Box>
            %
          </Stack>
          <Stack
            margin="8px"
            fontSize="24px"
            direction="row"
            style={{
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #ACACAC",
              boxShadow: "2px 2px 5px 3px #ACACAC;",
            }}
          >
            <Box fontSize="12px" mr="4px">
              전참/부참
            </Box>{" "}
            {getAttendeeStatus.fullAttend} : {getAttendeeStatus.halfAttend}
          </Stack>
          <Stack
            margin="8px"
            fontSize="24px"
            direction="row"
            style={{
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #ACACAC",
              boxShadow: "2px 2px 5px 3px #ACACAC;",
            }}
          >
            <Box fontSize="12px" mr="4px">
              버스 이동/카풀
            </Box>{" "}
            {getAttendeeStatus.goTogether} / {getAttendeeStatus.goCar}
          </Stack>
          <Stack
            margin="8px"
            fontSize="24px"
            direction="row"
            style={{
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #ACACAC",
              boxShadow: "2px 2px 5px 3px #ACACAC;",
            }}
          >
            <Box fontSize="12px" mr="4px">
              입금 처리{" "}
            </Box>{" "}
            {(
              (getAttendeeStatus.completeDeposit / getAttendeeStatus.all) *
              100
            ).toFixed(1)}
            %
          </Stack>
        </Box>
      </Stack>
    )
  }

  function attendanceTime() {
    const format = (time: Date) => `${time.getMonth() + 1}.${time.getDate()}`

    const elementSize = {
      width: windowSize.width - 32,
      height: windowSize.height / 2 - 20,
    }

    const GRAPH_SIZE = 10
    const toDay = new Date()
    const last30Days = new Array(GRAPH_SIZE).fill(0).map((_) => new Date())
    last30Days.forEach((day, index) =>
      day.setDate(toDay.getDate() + (index - GRAPH_SIZE + 1))
    )
    const xAxis = last30Days.map((day) => format(day))

    const timeData: Record<string, number> = {}
    getAttendanceTimeList.forEach((time) => {
      const date = format(new Date(time))
      if (timeData[date]) {
        timeData[date] = timeData[date] + 1
      } else {
        timeData[date] = 1
      }
    })

    const WEIGHT = 5
    const STEP = 5

    return (
      <Stack>
        <Stack>일별 등록자 수</Stack>
        <svg height={elementSize.height}>
          <rect
            fillOpacity="0"
            width={elementSize.width}
            height={elementSize.height}
            stroke="black"
            strokeWidth="1"
          />
          {xAxis.map((xValue, index) => (
            <text
              x={(elementSize.width / xAxis.length) * index}
              y={elementSize.height - STEP}
              fontSize="12px"
            >
              {xValue}
            </text>
          ))}
          {xAxis.map((xValue, index) => (
            <rect
              x={(elementSize.width / xAxis.length) * index + 3}
              y={elementSize.height - timeData[xValue] * WEIGHT - 20}
              width="10"
              height={timeData[xValue] * WEIGHT}
            />
          ))}
          {xAxis.map((xValue, index) => (
            <text
              x={(elementSize.width / xAxis.length) * index + 5}
              y={elementSize.height - timeData[xValue] * WEIGHT - 25}
              fontSize="12px"
            >
              {timeData[xValue]}
            </text>
          ))}
        </svg>
      </Stack>
    )
  }

  function ageInfo() {
    const format = (time: Date) => `${time.getMonth() + 1}.${time.getDate()}`

    const elementSize = {
      width: windowSize.width - 32,
      height: windowSize.height / 2 - 20,
    }

    const GRAPH_SIZE = Object.keys(getAgeInfoList).length
    const xAxis = Object.keys(getAgeInfoList)

    const WEIGHT = 5
    const STEP = 5

    return (
      <Stack>
        <Stack>나이별 등록자 수</Stack>
        <svg height={elementSize.height}>
          <rect
            fillOpacity="0"
            width={elementSize.width}
            height={elementSize.height}
            stroke="black"
            strokeWidth="1"
          />
          {xAxis.map((xValue, index) => (
            <text
              x={(elementSize.width / xAxis.length) * index}
              y={elementSize.height - STEP}
              fontSize="12px"
            >
              {xValue}
            </text>
          ))}
          {xAxis.map((xValue, index) => (
            <rect
              x={(elementSize.width / xAxis.length) * index + 3}
              y={elementSize.height - getAgeInfoList[xValue] * WEIGHT - 20}
              width="10"
              height={getAgeInfoList[xValue] * WEIGHT}
            />
          ))}
          {xAxis.map((xValue, index) => (
            <text
              x={(elementSize.width / xAxis.length) * index + 5}
              y={elementSize.height - getAgeInfoList[xValue] * WEIGHT - 25}
              fontSize="12px"
            >
              {getAgeInfoList[xValue]}
            </text>
          ))}
        </svg>
      </Stack>
    )
  }

  return (
    <Stack
      width="100%"
      height="100%"
      style={{
        margin: "12px",
      }}
    >
      <Stack direction="row" height="50%">
        <Stack>{attendeeStatus()}</Stack>
      </Stack>
      <Stack mt="12px">{attendanceTime()}</Stack>
      <Stack mt="12px">{ageInfo()}</Stack>
    </Stack>
  )
}

export default DashBoard
