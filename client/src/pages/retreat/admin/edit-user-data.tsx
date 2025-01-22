import { get, post } from "../../api"
import { useEffect, useState } from "react"
import { User } from "@server/entity/user"
import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material"
import UserInformationForm from "components/form/UserInformationForm"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"
import { useRouter } from "next/router"
import { HowToMove } from "@server/entity/types"
import { InOutInfo } from "@server/entity/inOutInfo"
import { RetreatAttend } from "@server/entity/retreatAttend"

export default function EditUserData() {
  const { push } = useRouter()
  const [userList, setUserList] = useState([] as Array<User>)
  const [selectedUserId, setSelectedUserId] = useState(0)
  const [retreatAttend, setRetreatAttend] = useState<RetreatAttend | undefined>(
    undefined
  )
  const [inOutData, setInOutData] = useState<Array<InOutInfo>>([])
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    get("/admin/get-all-user")
      .then((response: Array<User>) => {
        setUserList(response.sort((a, b) => (a.name > b.name ? 1 : -1)))
        if (response.length > 0) {
          setSelectedUserId(response[0].id)
        }
      })
      .catch(() => {
        push("/retreat/admin")
        setNotificationMessage("권한이 없습니다.")
        return
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
        setRetreatAttend(response.userData)
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
    <Stack justifyContent="center" bgcolor="#2d422a">
      <Stack margin="8px" color="white">
        수정 할 사람 선택
        <Stack m="4px" />
        <Select value={selectedUserId} onChange={onClickUser}>
          {userList.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name} ({user.yearOfBirth})
              {user.retreatAttend?.howToGo !== HowToMove.together &&
              (!user.retreatAttend?.inOutInfos ||
                user.retreatAttend?.inOutInfos.length === 0)
                ? " (카풀 확인 필요)"
                : ""}
              {user.etc ? "*" : ""}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Stack p="8x" border="1px solid grey" m="8px" borderRadius="12px">
        <UserInformationForm
          retreatAttend={retreatAttend}
          inOutData={inOutData}
          reloadFunction={loadData}
          setEditMode={() => {}}
        />
      </Stack>
      <Box height="50px" />
      <Stack m="12px" flex={1}>
        <Button variant="contained" color="error" onClick={deleteUser}>
          접수 삭제
        </Button>
      </Stack>
    </Stack>
  )
}
