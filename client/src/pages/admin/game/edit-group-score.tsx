import {
  Button,
  Input,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material"
import { useEffect, useState } from "react"
import { Team } from "@entity/teamScore"
import { get, post } from "pages/api"
import { NotificationMessage } from "state/notification"
import { useSetRecoilState } from "recoil"

export default function EditTeamScore() {
  const [teamScoreList, setTeamScoreList] = useState<Array<Team>>([])
  const [newTeamName, setNewTeamName] = useState<string>("")
  const [selectedGame, setSelectedGame] = useState<number>(1)
  const [scoreList, setScoreList] = useState<Array<number>>([])
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const teamList = await get("/admin/team-list")
    setTeamScoreList(teamList.scoreData)
  }

  async function createNewTeam() {
    const { result } = await post("/admin/inert-team-name", {
      teamName: newTeamName,
    })
    if (result === "success") {
      setNotificationMessage("새로운 조가 등록되었습니다.")
      fetchData()
    }
  }

  useEffect(() => {
    setScoreList(
      teamScoreList.map(
        (team) =>
          team.teamScore.find((data) => data.gameNumber === selectedGame)
            ?.score || 0
      )
    )
  }, [selectedGame])

  async function saveScore() {
    const { result } = await post("/admin/edit-team-score", {
      gameNumber: selectedGame,
      gameScore: scoreList,
    })
    if (result === "success") {
      setNotificationMessage("점수가 등록되었습니다.")
      fetchData()
    }
    await fetchData()
  }

  return (
    <Stack padding="12px">
      <Stack>
        <Stack>조 관리</Stack>
        <Stack direction="row" gap="12px">
          <TextField
            placeholder="추가할 조의 이름을 입력하세요."
            onChange={(e) => setNewTeamName(e.target.value)}
          />
          <Button variant="contained" onClick={createNewTeam}>
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
            onChange={(e: any) => setSelectedGame(e.target.value)}
          >
            <MenuItem value={1}>미슐랭</MenuItem>
            <MenuItem value={2}>무지개암산왕</MenuItem>
            <MenuItem value={3}>내꿈은 국가대표</MenuItem>
            <MenuItem value={4}>이판사판 해봐요</MenuItem>
            <MenuItem value={5}>1Round</MenuItem>
            <MenuItem value={6}>2Round</MenuItem>
            <MenuItem value={7}>3Round</MenuItem>
            <MenuItem value={8}>4Round</MenuItem>
            <MenuItem value={9}>보너스 점수</MenuItem>
          </Select>
        </Stack>
        <Stack gap="8px">
          {teamScoreList.map((team, index) => (
            <Stack direction="row" alignItems="center">
              <Stack width="100px"> {team.teamName}</Stack>
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
