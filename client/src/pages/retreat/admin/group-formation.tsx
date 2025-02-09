import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { get, post } from "../../../pages/api"
import { useRouter } from "next/router"
import { NotificationMessage } from "state/notification"
import { useSetRecoilState } from "recoil"
import { InOutInfo } from "@server/entity/inOutInfo"
import { RetreatAttend } from "@server/entity/retreatAttend"
import Header from "components/retreat/admin/Header"

function GroupFormation() {
  const { push } = useRouter()
  const [unassignedUserList, setUnassignedUserList] = useState(
    [] as Array<RetreatAttend>
  )
  const [groupList, setGroupList] = useState([] as Array<Array<RetreatAttend>>)
  const [selectedUser, setSelectedUser] = useState<RetreatAttend>()
  const [mousePoint, setMousePoint] = useState([0, 0])
  const [maxGroupNumber, setMaxGroupNumber] = useState(0)
  const [isShowUserInfo, setIsShowUserInfo] = useState(false)
  const [showUserInfo, setShowUserInfo] = useState({} as RetreatAttend)
  const [userAttendInfoCache, setUserAttendInfoCache] = useState(
    [] as Array<Array<InOutInfo>>
  )
  const [userAttendInfo, setUserAttendInfo] = useState([] as Array<InOutInfo>)
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
    get("/retreat/admin/get-retreat-group-formation")
      .then((response: Array<RetreatAttend>) => {
        const unassignedUserList = response
          .filter((user) => user.groupNumber === 0)
          .sort((a, b) => a.user.yearOfBirth - b.user.yearOfBirth)
        setUnassignedUserList(unassignedUserList)

        const group = [] as Array<Array<RetreatAttend>>
        const assignedUserList = response.filter(
          (retreatAttend) => retreatAttend.groupNumber !== 0
        )
        assignedUserList.map((retreatAttend) => {
          const groupNumber = retreatAttend.groupNumber - 1
          if (!group[groupNumber]) {
            group[groupNumber] = [retreatAttend]
          } else {
            group[groupNumber].push(retreatAttend)
          }
          setGroupList(group)
        })
        const maxNumber = Math.max(
          ...response.map((retreatAttend) => retreatAttend.groupNumber)
        )
        setMaxGroupNumber(maxNumber)
      })
      .catch(() => {
        push("/retreat/admin")
        setNotificationMessage("권한이 없습니다.")
        return
      })
  }

  function unassignedUserRow(retreatAttend: RetreatAttend) {
    return (
      <Stack
        direction="row"
        onMouseDown={() => setSelectedUser(retreatAttend)}
        onMouseUp={() => setGroup(0)}
        onMouseEnter={() => {
          setModal(retreatAttend)
        }}
        onMouseLeave={() => {
          setIsShowUserInfo(false)
        }}
        sx={{
          justifyContent: "space-between",
          backgroundColor:
            retreatAttend.user.gender === "man" ? "lightblue" : "pink",
        }}
        px="4px"
      >
        <Box>
          {retreatAttend.user.name}({retreatAttend.user.yearOfBirth})
          {retreatAttend.user.etc ||
          (retreatAttend.inOutInfos && retreatAttend.inOutInfos.length) > 0
            ? "*"
            : ""}
        </Box>
      </Stack>
    )
  }

  function userGroupRow(retreatAttend: RetreatAttend) {
    return (
      <Stack
        direction="row"
        p="2px"
        onMouseDown={() => setSelectedUser(retreatAttend)}
        width="160px"
        onMouseEnter={() => {
          setModal(retreatAttend)
        }}
        onMouseLeave={() => {
          setIsShowUserInfo(false)
        }}
        sx={{
          justifyContent: "space-between",
          backgroundColor:
            retreatAttend.user.gender === "man" ? "lightblue" : "pink",
        }}
      >
        <Box>
          {retreatAttend.user.name}({retreatAttend.user.yearOfBirth})
          {retreatAttend.etc ||
          (retreatAttend.inOutInfos && retreatAttend.inOutInfos.length) > 0
            ? "*"
            : ""}
        </Box>
      </Stack>
    )
  }

  function setModal(retreatAttend: RetreatAttend) {
    setIsShowUserInfo(true)
    setShowUserInfo(retreatAttend)
    setUserAttendInfo(retreatAttend.inOutInfos)
  }

  function Group(groupNumber: number, userList: Array<RetreatAttend>) {
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
    selectedUser.groupNumber = groupNumber
    await post("/retreat/admin/set-retreat-group", {
      selectedUser: selectedUser,
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
            {[, "첫", "둘", "셋"][info.day]}째 날 / {info.time} /{" "}
            {info.inOutType === "in" ? "들어옴" : "나감"}
          </Stack>
        ))}
      </Stack>
    )
  }

  return (
    <Stack>
      <Header />
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
            const group = groupList[index]
            if (!group || group.length === 0) {
              return Group(index + 1, [])
            } else {
              return Group(
                group[0].groupNumber,
                group.sort((a, b) => a.user.yearOfBirth - b.user.yearOfBirth)
              )
            }
          })}
          {Group(maxGroupNumber + 1, [])}
        </Stack>
      </Stack>
    </Stack>
  )
}

export default GroupFormation
