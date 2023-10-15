import { GameType, HappyFestivalScore } from "@entity/happyFestivalScore"
import { Button, Stack, TextField } from "@mui/material"
import { get, post } from "pages/api"
import { useEffect, useState } from "react"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"

export default function HappyFestivalScorePage() {
  const [scoreList, setScoreList] = useState<HappyFestivalScore[]>([])
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    fetchData()
  }, [])

  function onChangeValue({ key, e, gender, isName }: any) {
    const foundScore = scoreList.find(
      (score) => score.gender === gender && score.gameType === key
    )
    if (foundScore) {
      if (isName) {
        foundScore.name = e.target.value.toString()
      } else {
        foundScore.score = e.target.value.toString()
      }
      setScoreList([...scoreList])
    } else {
      var newData: HappyFestivalScore
      if (isName) {
        newData = {
          gender,
          gameType: key,
          score: 0,
          id: 0,
          name: e.target.value.toString(),
        }
      } else {
        newData = {
          gender,
          gameType: key,
          score: e.target.value.toString(),
          id: 0,
          name: "",
        }
      }
      setScoreList([...scoreList, newData])
    }
  }

  async function save() {
    const query = scoreList.map(async (score) => {
      await post("/happy-festival/save-score", score)
    })
    await Promise.all(query)
    setNotificationMessage(`점수가 저장이 되었습니다.`)
  }

  async function fetchData() {
    const data = await get("/happy-festival/score-list")
    setScoreList(data)
  }

  return (
    <Stack gap="8px" padding="12px">
      {Object.entries(GameType).map(([key, value]) => {
        if (key.length !== 1) {
          return
        }
        const manScore = scoreList.find(
          (score) => score.gender === "남" && score.gameType.toString() === key
        )
        const womanScore = scoreList.find(
          (score) => score.gender === "여" && score.gameType.toString() === key
        )
        return (
          <Stack alignItems="center" direction="row" gap="8px">
            {value} 남
            <TextField
              value={manScore?.name}
              onChange={(e) =>
                onChangeValue({ key, e, gender: "남", isName: true })
              }
            />
            <TextField
              value={manScore?.score}
              onChange={(e) =>
                onChangeValue({ key, e, gender: "남", isName: false })
              }
            />
            여
            <TextField
              value={womanScore?.name}
              onChange={(e) =>
                onChangeValue({ key, e, gender: "여", isName: true })
              }
            />
            <TextField
              value={womanScore?.score}
              onChange={(e) =>
                onChangeValue({ key, e, gender: "여", isName: false })
              }
            />
          </Stack>
        )
      })}
      <Button onClick={save}>저장</Button>
    </Stack>
  )
}
