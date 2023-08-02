import { Box, Stack } from "@mui/material"
import { User } from "@entity/user"
import { useEffect, useState } from "react"
import { get, post } from "../../pages/api"
import { InOutInfo } from "@entity/inOutInfo"
import { AttendType } from "@entity/types"

function GroupFormation() {
  const [unassignedUserList, setUnassignedUserList] = useState(
    [] as Array<User>
  )
  const [groupList, setGroupList] = useState([] as Array<Array<User>>)
  const [selectedUser, setSelectedUser] = useState<User>()
  const [mousePoint, setMousePoint] = useState([0, 0])
  const [maxGroupNumber, setMaxGroupNumber] = useState(0)
  const [isShowUserInfo, setIsShowUserInfo] = useState(false)
  const [showUserInfo, setShowUserInfo] = useState({} as User)
  const [userAttendInfoCache, setUserAttendInfoCache] = useState(
    [] as Array<Array<InOutInfo>>
  )
  const [userAttendInfo, setUserAttendInfo] = useState([] as Array<InOutInfo>)

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
    get("/admin/get-group-formation").then((response: Array<User>) => {
      const unassignedUserList = response
        .filter((user) => user.groupAssignment.groupNumber === 0)
        .sort((a, b) => a.age - b.age)
      setUnassignedUserList(unassignedUserList)

      const group = [] as Array<Array<User>>
      const assignedUserList = response.filter(
        (user) => user.groupAssignment.groupNumber !== 0
      )
      assignedUserList.map((user) => {
        const groupNumber = user.groupAssignment.groupNumber - 1
        if (!group[groupNumber]) {
          group[groupNumber] = [user]
        } else {
          group[groupNumber].push(user)
        }
        setGroupList(group)
      })
      const maxNumer = Math.max(
        ...response.map((user) => user.groupAssignment.groupNumber)
      )
      setMaxGroupNumber(maxNumer)
    })
  }

  function unassignedUserRow(user: User) {
    return (
      <Stack
        direction="row"
        onMouseDown={() => setSelectedUser(user)}
        onMouseUp={() => setGroup(0)}
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
          {user.name}({user.age}) (
          {user.attendType === AttendType.full ? "전" : "부"})
          {user.etc || (user.inOutInfos && user.inOutInfos.length) > 0
            ? "*"
            : ""}
        </Box>
        <Box>{user.groupAssignment.groupNumber}</Box>
      </Stack>
    )
  }

  function userGroupRow(user: User) {
    return (
      <Stack
        direction="row"
        p="2px"
        onMouseDown={() => setSelectedUser(user)}
        width="160px"
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
      >
        <Box>
          {user.name}({user.age}) (
          {user.attendType === AttendType.full ? "전" : "부"})
          {user.etc || (user.inOutInfos && user.inOutInfos.length) > 0
            ? "*"
            : ""}
        </Box>
      </Stack>
    )
  }

  function setModal(user: User) {
    setIsShowUserInfo(true)
    setShowUserInfo(user)
    setUserAttendInfo(user.inOutInfos)
  }

  function Group(groupNumber: number, userList: Array<User>) {
    return (
      <Stack
        sx={{
          margin: "8px",
          minHeight: "20px",
          borderRadius: "8px",
          border: "1px solid #ACACAC",
          boxShadow: "2px 2px 5px 3px #ACACAC;",
        }}
        onMouseUp={() => setGroup(groupNumber)}
      >
        <Stack width="160px" textAlign="center" py="4px">
          {groupNumber}조 ({userList.length})
        </Stack>
        {userList.map((user) => userGroupRow(user))}
      </Stack>
    )
  }

  async function setGroup(groupNumber: number) {
    if (!selectedUser) {
      return
    }
    selectedUser.groupAssignment.groupNumber = groupNumber
    await post("/admin/set-group", {
      groupAssignment: selectedUser.groupAssignment,
    })
    fetchData()
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
          borderRadius: "12px",
          position: "absolute",
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

  return (
    <Stack direction="row">
      {modal()}
      <Stack
        style={{
          margin: "6px",
          minHeight: "20px",
          borderRadius: "8px",
          paddingBottom: "20px",
          boxShadow: "2px 2px 5px 3px #ACACAC;",
          border: "1px solid #ACACAC",
        }}
        onMouseUp={() => setGroup(0)}
        width="160px"
      >
        <Box textAlign="center" py="4px">
          미배정({unassignedUserList.length}명)
        </Box>
        {unassignedUserList.map((user) => unassignedUserRow(user))}
      </Stack>
      <Stack
        style={{
          flexWrap: "wrap",
          margin: "4px",
          width: "calc(100% - 200px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {new Array(maxGroupNumber).fill(0).map((_, index) => {
          const group = groupList[index].sort((a, b) => a.age - b.age)
          if (!group || group.length === 0) {
            return Group(index + 1, [])
          } else {
            return Group(group[0].groupAssignment.groupNumber, group)
          }
        })}
        {Group(maxGroupNumber + 1, [])}
      </Stack>
    </Stack>
  )
}

export default GroupFormation
