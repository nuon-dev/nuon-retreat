import { Stack } from "@mui/system"
import { get, post } from "../api"
import { useEffect, useState } from "react"
import { User } from "@entity/user"
import { Box, Button, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import UserInformationForm from "components/form/UserInformationForm"
import { InOutInfo } from "@entity/inOutInfo"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"

export default function EditUserData() {
  const [userList, setUserList] = useState([] as Array<User>)
  const [selectedUserId, setSelectedUserId] = useState(0)
  const [userData, setUserData] = useState({} as User)
  const [inOutData, setInOutData] = useState<Array<InOutInfo>>([])
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    get("/admin/get-all-user").then((response: Array<User>) => {
      setUserList(response.sort((a, b) => (a.name > b.name ? 1 : -1)))
      if (response.length > 0) {
        setSelectedUserId(response[0].id)
      }
    })
  }, [])

  function onClickUser(event: SelectChangeEvent<number>) {
    setSelectedUserId(Number(event.target.value))
    const userIndex = event.target.value as number
    loadData(userIndex)
  }

  function loadData(index: number = 0) {
    const userIndex = index === 0 ? selectedUserId : index

    get(`/admin/get-user-data?userId=${userIndex}`).then((response) => {
      if (response.result === "true") {
        setUserData(response.userData)
        setInOutData(response.inoutInfoList)
      }
    })
  }

  async function deleteUser() {
    const c = confirm(
      `${
        userList.find((user) => user.id === selectedUserId)?.name
      }의 정보를 삭제하시겠습니까?`
    )
    if (!c) {
      return
    }
    const { result } = await post("/admin/delete-user", {
      userId: selectedUserId,
    })

    if (result === "success") {
      setNotificationMessage("삭제되었습니다.")
    }
  }

  return (
    <Stack justifyContent="center">
      <Stack margin="8px">
        수정 할 사람 선택
        <Stack m="4px" />
        <Select value={selectedUserId} onChange={onClickUser}>
          {userList.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name} ({user.age}) (
              {user.kakaoId.startsWith("no") ? "일" : "카"})
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Stack>
        <UserInformationForm
          user={userData}
          inOutData={inOutData}
          reloadFunction={loadData}
        />
      </Stack>
      <Box height="50px" />
      <Stack width="100px" ml="100px">
        <Button variant="contained" color="error" onClick={deleteUser}>
          접수 삭제
        </Button>
      </Stack>
    </Stack>
  )
}
