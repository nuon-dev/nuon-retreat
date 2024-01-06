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
    setInterval(fetchData, 1000 * 10)
  }, [])

  function onChangeValue({ key, e, gender, isName }: any) {
    const foundScore = scoreList.find(
      (score) => score.gender === gender && score.gameType === key
    )
    console.log(foundScore)
    console.log(scoreList)
    if (foundScore) {
      if (isName) {
        foundScore.name = e.target.value.toString()
      } else {
        foundScore.score = e.target.value.toString()
      }
      setScoreList(
        scoreList.map((score) =>
          score.id === foundScore.id ? foundScore : score
        )
      )
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
    <Stack gap="20px" padding="12px">
      {Object.entries(GameType).map(([k, value]) => {
        if (k.length !== 1) {
          return
        }
        const key = Number.parseInt(k)
        const manScore = scoreList.find(
          (score) => score.gender === "남" && score.gameType === key
        )
        const womanScore = scoreList.find(
          (score) => score.gender === "여" && score.gameType === key
        )
        return (
          <Stack gap="4px" alignItems="center" justifyContent="center">
            {value}
            <Stack
              gap="8px"
              direction="row"
              alignItems="center"
              justifyContent="center"
            >
              남
              <TextField
                placeholder="이름"
                value={manScore?.name}
                onChange={(e) =>
                  onChangeValue({ key, e, gender: "남", isName: true })
                }
              />
              <TextField
                type="number"
                placeholder="점수"
                value={manScore?.score}
                onChange={(e) =>
                  onChangeValue({ key, e, gender: "남", isName: false })
                }
              />
            </Stack>
            <Stack
              gap="8px"
              direction="row"
              alignItems="center"
              justifyContent="center"
            >
              여
              <TextField
                placeholder="이름"
                value={womanScore?.name}
                onChange={(e) =>
                  onChangeValue({ key, e, gender: "여", isName: true })
                }
              />
              <TextField
                type="number"
                placeholder="점수"
                value={womanScore?.score}
                onChange={(e) =>
                  onChangeValue({ key, e, gender: "여", isName: false })
                }
              />
            </Stack>
          </Stack>
        )
      })}
      <Button variant="contained" onClick={save}>
        저장
      </Button>
    </Stack>
  )
}
