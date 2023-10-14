import { Box, Button, MenuItem, Select, Stack, TextField } from "@mui/material"
import { get, post } from "./api"
import { useEffect, useState } from "react"
import { User } from "@entity/user"
import { ANewLaity } from "@entity/aNewLaity"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"

export default function NewLaity() {
  const [userData, setUserData] = useState({} as User)
  const [newLaityList, setNewLaityList] = useState<ANewLaity[]>([])
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    checkToken()
    fetchData()
  }, [])

  useEffect(() => {
    if (!userData.id) {
      return
    }
    if (newLaityList.length === 0) {
      setNewLaityList([
        { user: userData, status: 0, newMemberName: "홍길동", id: 0 },
      ])
    }
  }, [userData])

  const checkToken = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      return
    }
    post("/auth/check-token", {
      token,
    }).then((response) => {
      if (response.result === "true") {
        setUserData(response.userData)
      }
    })
  }

  async function save() {
    const queryList = newLaityList.map((newLaity) =>
      post("/new-laity/save", newLaity)
    )

    await post("/auth/edit-user", userData)
    await Promise.all(queryList)
    setNotificationMessage(`신청 내역이 저장이 되었습니다.`)
    fetchData()
  }

  async function fetchData() {
    const result = (await get("/new-laity/my-list")) as ANewLaity[]
    if (result.length === 0) {
      return
    }
    setNewLaityList(result)
  }

  async function deleteItem(index: number) {
    const newLaity = newLaityList[index]
    if (newLaity.id) {
      await post("/new-laity/delete", newLaity)
    }

    newLaityList.splice(index, 1)
    setNewLaityList([...newLaityList])
  }

  function onChangeInformation({
    index,
    filed,
    data,
  }: {
    index: number
    filed: keyof ANewLaity
    data: string
  }) {
    newLaityList[index] = {
      ...newLaityList[index],
      [filed]: data,
    }
    setNewLaityList([...newLaityList])
  }

  return (
    <Stack
      alignItems="center"
      gap="24px"
      justifyContent="center"
      padding="24px"
    >
      <Box fontSize="30px" fontWeight="700px" color="#555">
        태신자 작성
      </Box>
      <Stack
        gap="24px"
        display="flex"
        direction="row"
        fontSize="20px"
        alignItems="center"
        justifyContent="center"
      >
        본인 이름
        <TextField
          variant="outlined"
          value={userData.name}
          onChange={(e) => {
            setUserData({
              ...userData,
              name: e.target.value.toString(),
            })
          }}
        />
      </Stack>

      <Button
        variant="contained"
        style={{
          width: "90%",
        }}
        onClick={() => {
          setNewLaityList([
            ...newLaityList,
            { user: userData, status: 0, newMemberName: "" } as any,
          ])
        }}
      >
        새신자 추가
      </Button>

      <Box border="1px solid #ccc" height="0px" width="90%" marginY="24px" />
      {newLaityList.map((newLaity, index) => (
        <Stack gap="8px" direction="row" width="90%">
          <TextField
            label="태신자 이름"
            value={newLaity.newMemberName}
            onChange={(e) =>
              onChangeInformation({
                index,
                filed: "newMemberName",
                data: e.target.value.toString(),
              })
            }
          />
          <Select
            style={{
              width: "130px",
            }}
            value={newLaity.status}
            label="Age"
            onChange={(e) =>
              onChangeInformation({
                index,
                filed: "status",
                data: e.target.value.toString(),
              })
            }
          >
            <MenuItem value={0}>고민 중</MenuItem>
            <MenuItem value={1}>참석 확정</MenuItem>
            <MenuItem value={2}>불참 확정</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteItem(index)}
          >
            삭제
          </Button>
        </Stack>
      ))}
      <Button
        variant="contained"
        onClick={save}
        color="success"
        style={{
          width: "90%",
        }}
      >
        저장
      </Button>
    </Stack>
  )
}
