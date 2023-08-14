import {
  Button,
  Input,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material"
import { useEffect, useState } from "react"
import { GroupScore } from "@entity/groupScore"
import { get, post } from "pages/api"
import { NotificationMessage } from "state/notification"
import { useSetRecoilState } from "recoil"

export default function EditGroupScore() {
  const [groupScoreList, setGroupScoreList] = useState<Array<GroupScore>>([])
  const [newGroupName, setNewGroupName] = useState<string>("")
  const [selectedGame, setSelectedGame] = useState<number>(1)
  const [scoreList, setScoreList] = useState<Array<number>>([])
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const groupList = await get("/admin/group-list")
    setGroupScoreList(groupList.scoreData)
  }

  async function createNewGroup() {
    const { result } = await post("/admin/inert-group-name", {
      groupName: newGroupName,
    })
    if (result === "success") {
      setNotificationMessage("새로운 조가 등록되었습니다.")
      fetchData()
    }
  }

  useEffect(() => {
    console.log(groupScoreList)
    setScoreList(
      groupScoreList.map(
        (group) =>
          group.groupScore.find((data) => data.gameNumber === selectedGame)
            ?.score || 0
      )
    )
  }, [selectedGame])

  async function saveScore() {
    await post("/admin/edit-group-score", {
      gameNumber: selectedGame,
      gameScore: scoreList,
    })
    await fetchData()
  }

  return (
    <Stack padding="12px">
      <Stack>
        <Stack>조 관리</Stack>
        <Stack direction="row" gap="12px">
          <TextField
            placeholder="추가할 조의 이름을 입력하세요."
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <Button variant="contained" onClick={createNewGroup}>
            추가
          </Button>
        </Stack>
      </Stack>
      <Stack>
        <Stack>점수 관리</Stack>
        <Stack direction="row" gap="12px" alignItems="center" p="12px">
          게임 선택{" "}
          <Select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
          >
            <MenuItem value={1}>게임 1번</MenuItem>
            <MenuItem value={2}>게임 2번</MenuItem>
          </Select>
        </Stack>
        <Stack gap="8px">
          {groupScoreList.map((group, index) => (
            <Stack direction="row" alignItems="center">
              <Stack width="100px"> {group.groupName}</Stack>
              <Input
                value={scoreList[index]}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value) || 0
                  scoreList[index] = value
                  setScoreList([...scoreList])
                }}
              />
              점
            </Stack>
          ))}
          <Button variant="contained" onClick={saveScore}>
            저장
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}
