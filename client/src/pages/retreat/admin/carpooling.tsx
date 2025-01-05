import { InOutInfo } from "@entity/inOutInfo"
import { get, post } from "../../../pages/api"
import { useEffect, useState } from "react"
import { Box, MenuItem, Select, Stack } from "@mui/material"
import { User } from "@entity/user"
import { useRouter } from "next/router"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"
import { Days, InOutType, MoveType } from "@entity/types"

function Carpooling() {
  const router = useRouter()
  const setNotificationMessage = useSetRecoilState(NotificationMessage)
  const [carList, setCarList] = useState([] as InOutInfo[])
  const [rideUserList, setRideUserList] = useState([] as InOutInfo[])
  const [selectedInfo, setSelectedInfo] = useState({} as InOutInfo)

  const [selectedDay, setSelectedDay] = useState<Number>(Days.firstDay)
  const [selectedInOut, setSelectedInOut] = useState<string>(InOutType.IN)
  const [mousePoint, setMousePoint] = useState([0, 0])
  const [isShowUserInfo, setIsShowUserInfo] = useState(false)
  const [showUserInfo, setShowUserInfo] = useState({} as User)

  function onMouseMove(event: MouseEvent) {
    setMousePoint([event.pageX, event.pageY])
  }

  useEffect(() => {
    fetchData()
    addEventListener("mousemove", onMouseMove)

    return () => {
      removeEventListener("mousemove", onMouseMove)
    }
  }, [])

  function modal() {
    if (!isShowUserInfo) {
      return <Stack />
    }
    return (
      <Stack
        style={{
          position: "absolute",
          top: mousePoint[1] + 10,
          left: mousePoint[0] + 10,
          border: "1px solid #CCC",
          borderRadius: "12px",
          padding: "4px",
          backgroundColor: "white",
        }}
      >
        {showUserInfo.etc}
        <Stack height="1px" bgcolor="#DDD" my="4px" />
        {showUserInfo.phone}
      </Stack>
    )
  }

  async function setCar(car: InOutInfo) {
    selectedInfo.rideCarInfo = car
    await post("/admin/set-car", {
      inOutInfo: selectedInfo,
    })
    fetchData()
  }

  async function setEmptyCar() {
    selectedInfo.rideCarInfo = null
    await post("/admin/set-car", {
      inOutInfo: selectedInfo,
    })
    fetchData()
  }

  function fetchData() {
    get("/admin/get-car-info")
      .then((data: InOutInfo[]) => {
        const cars = data.filter(
          (info) => info.howToMove === MoveType.driveCarWithPerson
        )
        setCarList(cars)
        const rideUsers = data.filter(
          (info) =>
            (info.howToMove === MoveType.rideCar && !info.rideCarInfo) ||
            (info.howToMove === MoveType.goAlone && !info.rideCarInfo)
        )
        setRideUserList(rideUsers)
      })
      .catch(() => {
        router.push("/admin")
        setNotificationMessage("권한이 없습니다.")
        return
      })
  }

  function setModal(user: User) {
    setIsShowUserInfo(true)
    setShowUserInfo(user)
  }

  function getRowOfInfo(info: InOutInfo) {
    return (
      <Stack
        my="4px"
        borderRadius="4px"
        direction="column"
        border="1px solid #ACACAC"
        onMouseEnter={() => {
          setModal(info.user)
        }}
        onMouseLeave={() => {
          setIsShowUserInfo(false)
        }}
        onMouseDown={() => setSelectedInfo(info)}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-evenly"
        >
          <Box>{info.user?.name}</Box>{" "}
          <Box textAlign="center">{info.time}시</Box>{" "}
          <Box>
            {info.howToMove === MoveType.goAlone ? "여주역" : info.position}
          </Box>
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack direction="row">
      <Stack
        style={{
          margin: "12px",
        }}
      >
        <Select
          style={{
            marginBottom: "8px",
          }}
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value as number)}
        >
          <MenuItem value={Days.firstDay}>첫째날</MenuItem>
          <MenuItem value={Days.secondDay}>둘째날</MenuItem>
          <MenuItem value={Days.thirdDay}>셋째날</MenuItem>
        </Select>
        <Select
          value={selectedInOut}
          onChange={(e) => setSelectedInOut(e.target.value as string)}
        >
          <MenuItem value={InOutType.IN}>들어가는 차</MenuItem>
          <MenuItem value={InOutType.OUT}>나가는 차</MenuItem>
        </Select>
      </Stack>
      {modal()}
      <Stack
        style={{
          margin: "8px",
          padding: "4px",
          minWidth: "240px",
          borderRadius: "8px",
          paddingBottom: "20px",
          border: "1px solid #ACACAC",
          boxShadow: "2px 2px 5px 3px #ACACAC;",
        }}
        onMouseUp={setEmptyCar}
      >
        <Stack textAlign="center">탑승 예정자</Stack>
        {rideUserList
          .filter(
            (info) =>
              info.day === selectedDay && info.inOutType === selectedInOut
          )
          .map((info) => getRowOfInfo(info))}
      </Stack>
      <Stack
        style={{
          margin: "4px",
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          width: "calc(100% - 200px)",
        }}
        direction="row"
      >
        {carList
          .filter(
            (info) =>
              info.day === selectedDay && info.inOutType === selectedInOut
          )
          .map((car) => (
            <Stack
              sx={{
                margin: "8px",
                padding: "4px",
                minWidth: "240px",
                borderRadius: "8px",
                border: "1px solid #ACACAC",
                boxShadow: "2px 2px 5px 3px #ACACAC;",
              }}
              onMouseUp={() => setCar(car)}
            >
              <Stack
                justifyContent="space-evenly"
                textAlign="center"
                onMouseEnter={() => {
                  setModal(car.user)
                }}
                onMouseLeave={() => {
                  setIsShowUserInfo(false)
                }}
                direction="column"
              >
                <Stack direction="row" justifyContent="space-evenly">
                  <Box>{car.user.name}의 차</Box>
                  <Box>{car.time}시</Box>
                  <Box>{car.position}</Box>
                </Stack>
              </Stack>
              <Box height="1px" bgcolor="#DDD" my="4px" />
              {car.userInTheCar.map((info) => getRowOfInfo(info))}
            </Stack>
          ))}
      </Stack>
    </Stack>
  )
}

export default Carpooling
