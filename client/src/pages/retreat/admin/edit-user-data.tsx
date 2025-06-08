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
import { InOutInfo } from "@server/entity/retreat/inOutInfo"
import { RetreatAttend } from "@server/entity/retreat/retreatAttend"
import Header from "components/retreat/admin/Header"

export default function EditUserData() {
  const { push } = useRouter()
  const [userList, setUserList] = useState([] as Array<RetreatAttend>)
  const [selectedUserId, setSelectedUserId] = useState(0)
  const [retreatAttend, setRetreatAttend] = useState<RetreatAttend | undefined>(
    undefined
  )
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    get("/retreat/admin/get-all-user")
      .then((response: Array<RetreatAttend>) => {
        setUserList(
          response.sort((a, b) => (a.user.name > b.user.name ? 1 : -1))
        )
        if (global.location.search) {
          const retreadAttendId = new URLSearchParams(
            global.location.search
          ).get("retreadAttendId")
          setSelectedUserId(retreadAttendId ? Number(retreadAttendId) : 0)
        } else if (response.length > 0) {
          setSelectedUserId(response[0].id)
        }
      })
      .catch(() => {
        push("/retreat/admin")
        setNotificationMessage("권한이 없습니다.")
        return
      })
  }, [])

  useEffect(() => {
    loadData(selectedUserId)
  }, [selectedUserId])

  function onClickUser(event: SelectChangeEvent<number>) {
    setSelectedUserId(Number(event.target.value))
  }

  function loadData(targetUserId: number = 0) {
    const userId = targetUserId === 0 ? selectedUserId : targetUserId

    get(`/retreat/admin/get-user-data?userId=${userId}`).then((response) => {
      if (response.result === "true") {
        setRetreatAttend(response.userData)
      }
    })
  }

  async function deleteUser() {
    const c = confirm(
      `${
        userList.find((retreatAttend) => retreatAttend.id === selectedUserId)
          ?.user.name
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
      <Header />
      <Stack margin="8px" color="white">
        수정 할 사람 선택
        <Stack m="4px" />
        <Select value={selectedUserId} onChange={onClickUser}>
          {userList.map((retreatAttend) => (
            <MenuItem key={retreatAttend.id} value={retreatAttend.id}>
              {retreatAttend.user.name} ({retreatAttend.user.yearOfBirth})
              {retreatAttend.etc ? "*" : ""}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Stack p="8x" border="1px solid grey" m="8px" borderRadius="12px">
        <UserInformationForm
          retreatAttend={retreatAttend}
          reloadFunction={loadData}
          setEditMode={() => {}}
        />
      </Stack>
      <Box height="50px" />
      {selectedUserId && (
        <Stack m="12px" flex={1}>
          <Button variant="contained" color="error" onClick={deleteUser}>
            접수 삭제
          </Button>
        </Stack>
      )}
    </Stack>
  )
}
