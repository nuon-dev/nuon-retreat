import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { get } from "./api"
import { GameType, HappyFestivalScore } from "@entity/happyFestivalScore"

export default function HappyFestival() {
  const [scoreList, setScoreList] = useState<HappyFestivalScore[]>([])
  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const data = await get("/happy-festival/score-list")
    setScoreList(data)
  }

  return (
    <Stack padding="30px">
      <Stack textAlign="center">
        2023 행복축제
        <br />
        점수 현황판
      </Stack>
      <Stack
        direction="row"
        gap="200px"
        flexWrap="wrap"
        justifyContent="center"
        padding="50px"
      >
        {Object.entries(GameType).map(([key, value]) => {
          if (key.length !== 1) {
            return
          }
          const manScore = scoreList.find(
            (score) =>
              score.gender === "남" && score.gameType.toString() === key
          )
          const womanScore = scoreList.find(
            (score) =>
              score.gender === "여" && score.gameType.toString() === key
          )

          return (
            <Stack border="1px solid black" width="200px">
              <Box textAlign="center">{value}</Box>
              <Stack textAlign="center">
                남자 1등 : {manScore?.name} ({manScore?.score})
              </Stack>
              <Stack textAlign="center">
                여자 1등 : {womanScore?.name} ({womanScore?.score})
              </Stack>
            </Stack>
          )
        })}
      </Stack>
    </Stack>
  )
}
