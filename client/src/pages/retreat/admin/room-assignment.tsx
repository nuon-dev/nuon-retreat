import { Box, Button, Stack } from "@mui/material"
import { User } from "@server/entity/user"
import { useEffect, useState } from "react"
import { get, post } from "../../../pages/api"
import { useRouter } from "next/router"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"
import { InOutInfo } from "@server/entity/inOutInfo"

function RoomAssingment() {
  const { push } = useRouter()
  const [unassignedUserList, setUnassignedUserList] = useState(
    [] as Array<User>
  )
  const [roomList, setRoomList] = useState([] as Array<Array<User>>)
  const [selectedUser, setSelectedUser] = useState<User>()
  const [maxRoomNumber, setMaxRoomNumber] = useState(0)
  const [isShowUserInfo, setIsShowUserInfo] = useState(false)
  const [showUserInfo, setShowUserInfo] = useState({} as User)
  const [userAttendInfo, setUserAttendInfo] = useState([] as Array<InOutInfo>)
  const [userAttendInfoCache, setUserAttendInfoCache] = useState(
    [] as Array<Array<InOutInfo>>
  )
  const [mousePoint, setMousePoint] = useState([0, 0])
  const [sex, setSex] = useState("man")
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

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

  function fetchData() {
    get("/admin/get-room-assignment")
      .then((response: Array<User>) => {
        const unassignedUserList = response
          .filter(
            (user) =>
              !user.roomAssignment ||
              user.roomAssignment.isUpdated ||
              user.roomAssignment.roomNumber === 0
          )
          .sort((a, b) => a.age - b.age)
        setUnassignedUserList(unassignedUserList)

        const room = [] as Array<Array<User>>
        const assignedUserList = response.filter(
          (user) => user.roomAssignment && !user.roomAssignment.isUpdated
        )
        assignedUserList.map((user) => {
          const roomNumber = user.roomAssignment.roomNumber - 1
          if (!room[roomNumber]) {
            room[roomNumber] = [user]
          } else {
            room[roomNumber].push(user)
            room[roomNumber].sort((a, b) => a.age - b.age)
          }
          setRoomList(room)
        })
        const maxNumer = Math.max(
          ...response.map(
            (user) => user.roomAssignment && user.roomAssignment.roomNumber
          )
        )
        setMaxRoomNumber(maxNumer)
      })
      .catch(() => {
        push("/retreat/admin")
        setNotificationMessage("권한이 없습니다.")
        return
      })
  }

  function unassignedUserRow(user: User) {
    return (
      <Stack
        direction="row"
        onMouseDown={() => setSelectedUser(user)}
        onMouseUp={() => setRoom(0)}
        onMouseEnter={() => {
          setModal(user)
        }}
        onMouseLeave={() => {
          setIsShowUserInfo(false)
        }}
        sx={{
          justifyContent: "space-between",
          backgroundColor: user.sex === "man" ? "lightblue" : "pink",
        }}
        px="4px"
      >
        <Box>
          {user.name}({user.age})
          {user.etc || (user.inOutInfos && user.inOutInfos.length) > 0
            ? "*"
            : ""}
        </Box>
        <Box>{user.roomAssignment?.roomNumber}</Box>
      </Stack>
    )
  }

  function modal() {
    if (!isShowUserInfo) {
      return <Stack />
    }
    if (!showUserInfo.etc && userAttendInfo.length === 0) {
      return <Stack />
    }
    return (
      <Stack
        style={{
          padding: "6px",
          position: "absolute",
          borderRadius: "4px",
          top: mousePoint[1] + 10,
          left: mousePoint[0] + 10,
          backgroundColor: "#FEFEFE",
          border: "1px solid #ACACAC",
        }}
      >
        {showUserInfo.etc}
        {showUserInfo.etc && userAttendInfo.length > 0 && (
          <Box width="100%" height="1px" bgcolor="#ACACAC" my="4px" />
        )}
        {userAttendInfo.map((info) => (
          <Stack>
            {["첫", "둘", "셋"][info.day]}째 날 / {info.time} /{" "}
            {info.inOutType === "in" ? "들어옴" : "나감"}
          </Stack>
        ))}
      </Stack>
    )
  }

  function setModal(user: User) {
    setIsShowUserInfo(true)
    setShowUserInfo(user)
    setUserAttendInfo(user.inOutInfos)
  }

  function userRoomRow(user: User) {
    return (
      <Stack
        direction="row"
        p="2px"
        onMouseDown={() => setSelectedUser(user)}
        onMouseEnter={() => {
          setModal(user)
        }}
        onMouseLeave={() => {
          setIsShowUserInfo(false)
        }}
        width="160px"
        sx={{
          justifyContent: "space-between",
          backgroundColor: user.sex === "man" ? "lightblue" : "pink",
        }}
      >
        <Box>
          {user.name}({user.age})
          {user.etc || (user.inOutInfos && user.inOutInfos.length) > 0
            ? "*"
            : ""}
        </Box>
      </Stack>
    )
  }

  function Room(roomNumber: number, userList: Array<User>) {
    return (
      <Stack
        sx={{
          margin: "8px",
          minHeight: "20px",
          borderRadius: "8px",
          boxShadow: "2px 2px 5px 3px #ACACAC;",
          border: "1px solid #ACACAC",
        }}
        onMouseUp={() => setRoom(roomNumber)}
      >
        <Stack width="160px" textAlign="center" py="4px">
          {roomNumber}번 방 (
          {userList.filter((user) => user.sex === sex).length})
        </Stack>
        {userList
          .filter((user) => user.sex === sex)
          .map((user) => userRoomRow(user))}
      </Stack>
    )
  }

  async function setRoom(roomNumber: number) {
    if (!selectedUser) {
      return
    }
    selectedUser.roomAssignment.roomNumber = roomNumber
    selectedUser.roomAssignment.isUpdated = false
    await post("/admin/set-room", {
      roomAssignment: selectedUser.roomAssignment,
    })
    fetchData()
  }

  return (
    <Stack ml="12px">
      <Stack
        direction="row"
        mb="12px"
        justifyContent="space-between"
        alignContent="center"
      >
        <Stack />
        <Stack direction="row">
          <Stack fontWeight="600" fontSize="24px" justifyContent="center">
            {sex === "man" ? "남자" : "여자"} 방배정
          </Stack>
          <Button
            variant="outlined"
            onClick={() => setSex(sex === "man" ? "woman" : "man")}
            style={{
              margin: "16px",
            }}
          >
            성별 변경 하기
          </Button>
        </Stack>
        <Stack
          style={{
            backgroundColor: "#FAFAFA",
          }}
          margin="8px"
          padding="8px"
          borderRadius="8px"
          justifyContent="center"
          border="1px solid #ACACAC"
        >
          사람의 이름을 눌러 드래그 드롭으로 또는 사람 후 방을 클릭하여 넣으면
          됩니다.
          <br />
          마우스 오버시 사용자의 정보가 나옵니다.
          <br />
        </Stack>
      </Stack>
      {modal()}
      <Stack mb="40px" direction="row">
        <Stack
          style={{
            margin: "6px",
            minHeight: "20px",
            borderRadius: "8px",
            boxShadow: "2px 2px 5px 3px #ACACAC;",
            border: "1px solid #ACACAC",
            paddingBottom: "20px",
          }}
          onMouseUp={() => setRoom(0)}
          width="160px"
        >
          <Box textAlign="center" py="4px">
            미배정(
            {unassignedUserList.filter((user) => user.sex === sex).length}명)
          </Box>
          {unassignedUserList
            .filter((user) => user.sex === sex)
            .map((user) => unassignedUserRow(user))}
        </Stack>
        <Stack
          style={{
            padding: "4px",
            flexWrap: "wrap",
            margin: "4px",
            width: "calc(100% - 200px)",
            overflowWrap: "inherit",
            display: "flex",
            flexDirection: "row",
          }}
        >
          {new Array(maxRoomNumber).fill(0).map((_, index) => {
            const room = roomList[index]
            if (!room || room.length === 0) {
              return Room(index + 1, [])
            } else {
              return Room(room[0].roomAssignment.roomNumber, room)
            }
          })}
          {Room(maxRoomNumber + 1, [])}
        </Stack>
      </Stack>
    </Stack>
  )
}

export default RoomAssingment
