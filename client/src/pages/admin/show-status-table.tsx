import { CurrentStatus, HowToMove } from "@entity/types"
import { User } from "@entity/user"
import { Box, MenuItem, Select, Stack } from "@mui/material"
import { useRouter } from "next/router"
import { get } from "pages/api"
import { useEffect, useState } from "react"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"

export default function ShowStatusTable() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState(CurrentStatus.arriveChurch)
  const [allUserList, setAllUserList] = useState<Array<User>>([])
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    fetchUserData()
  }, [])

  async function fetchUserData() {
    try {
      const list: User[] = await get("/admin/get-all-user")
      if (list) {
        setAllUserList(list.sort((a, b) => a.age - b.age))
      }
    } catch {
      router.push("/admin")
      setNotificationMessage("권한이 없습니다.")
      return
    }
  }

  function ArriveCurchUserList() {
    const busUser = allUserList.filter(
      (user) => user.howToGo === HowToMove.together
    )
    const arriveUser = busUser.filter(
      (user) => user.currentStatus === CurrentStatus.arriveChurch
    )
    const notArriveUser = busUser.filter(
      (user) => user.currentStatus === CurrentStatus.null
    )
    return (
      <Stack gap="24px">
        도착해야 하는 인원 ({notArriveUser.length}명)
        <Stack direction="row" flexWrap="wrap" gap="12px">
          {notArriveUser.map((user) => (
            <Stack
              gap="24px"
              width="300px"
              padding="12px"
              direction="row"
              borderRadius="12px"
              bgcolor={user.sex === "man" ? "lightblue" : "pink"}
            >
              <Box>{user.name}</Box>
              <Box>{user.age}</Box>
              <Box>{user.phone}</Box>
            </Stack>
          ))}
        </Stack>
        도착한 인원 ({arriveUser.length}명)
        <Stack direction="row" flexWrap="wrap" gap="12px">
          {arriveUser.map((user) => (
            <NotArriveComponent user={user} />
          ))}
        </Stack>
      </Stack>
    )
  }

  function ArriveAuditoriumUserList() {
    const arriveUser = allUserList.filter(
      (user) => user.currentStatus === CurrentStatus.arriveAuditorium
    )

    const notArriveUser = allUserList
      .filter((user) => user.currentStatus !== CurrentStatus.arriveAuditorium)
      .sort(
        (a, b) =>
          new Date(`2024.02.0${a.whenIn}`).getTime() -
          new Date(`2024.02.0${b.whenIn}`).getTime()
      )
    return (
      <Stack gap="24px">
        도착해야 하는 인원 ({notArriveUser.length}명)
        <Stack direction="row" flexWrap="wrap" gap="12px">
          {notArriveUser.map((user) => (
            <Stack
              gap="24px"
              width="400px"
              padding="12px"
              direction="row"
              borderRadius="12px"
              bgcolor={user.sex === "man" ? "lightblue" : "pink"}
            >
              <Box>{user.name}</Box>
              <Box>02.0{user.whenIn}</Box>
              <Box>{user.age}</Box>
              <Box>{user.phone}</Box>
            </Stack>
          ))}
        </Stack>
        도착한 인원 ({arriveUser.length}명)
        <Stack direction="row" flexWrap="wrap" gap="12px">
          {arriveUser.map((user) => (
            <NotArriveComponent user={user} />
          ))}
        </Stack>
      </Stack>
    )
  }

  function NotArriveComponent({ user }: { user: User }) {
    return (
      <Stack
        gap="24px"
        width="150px"
        padding="12px"
        direction="row"
        borderRadius="12px"
        bgcolor={user.sex === "man" ? "lightblue" : "pink"}
      >
        <Box>{user.name}</Box>
        <Box>{user.age}</Box>
      </Stack>
    )
  }

  function UserListDisplayer() {
    switch (statusFilter) {
      case CurrentStatus.null:
        return <></>
      case CurrentStatus.arriveChurch:
        return <ArriveCurchUserList />
      case CurrentStatus.arriveAuditorium:
        return <ArriveAuditoriumUserList />
    }
    return <></>
  }

  return (
    <Stack p="24px" gap="12px">
      <Select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(Number.parseInt(e.target.value.toString()))
        }
      >
        <MenuItem value={CurrentStatus.arriveChurch}>교회 도착</MenuItem>
        <MenuItem value={CurrentStatus.arriveAuditorium}>
          수련회장 도착
        </MenuItem>
      </Select>
      <UserListDisplayer />
    </Stack>
  )
}
