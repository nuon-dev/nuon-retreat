import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { get } from "./api"
import { GameType, HappyFestivalScore } from "@entity/happyFestivalScore"

export default function HappyFestival() {
  const [scoreList, setScoreList] = useState<HappyFestivalScore[]>([])
  useEffect(() => {
    fetchData()
    setInterval(fetchData, 1000 * 10)
  }, [])

  async function fetchData() {
    const data = await get("/happy-festival/score-list")
    setScoreList(data)
  }

  function getScoreComponent(key: number, value: string) {
    const manScore = scoreList.find(
      (score) => score.gender === "남" && score.gameType === key
    )
    const womanScore = scoreList.find(
      (score) => score.gender === "여" && score.gameType === key
    )

    return (
      <Stack width="200px" color="#2E2E2E">
        <Stack fontSize="30px">
          {manScore?.name} / {manScore?.score} 점
        </Stack>
        <Stack fontSize="30px" mt="3vh">
          {womanScore?.name} / {womanScore?.score} 점
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack
      style={{
        width: "100vw",
        height: "100vh",
        backgroundSize: "",
        backgroundImage: "url(/happy_bg.png)",
      }}
      padding="30px"
    >
      <Stack marginTop="36vh" flexWrap="wrap" justifyContent="center">
        <Stack direction="row" justifyContent="space-evenly">
          <Stack ml="2vw">{getScoreComponent(GameType.축구, "축구")}</Stack>
          <Stack ml="2vw">{getScoreComponent(GameType.농구, "농구")}</Stack>
          <Stack ml="3vw">{getScoreComponent(GameType.다트, "다트")}</Stack>
        </Stack>
        <Stack direction="row" justifyContent="space-evenly" marginTop="19vh">
          <Stack ml="2vw">
            {getScoreComponent(GameType.두더지잡기, "두더지잡기")}
          </Stack>
          <Stack ml="2vw">{getScoreComponent(GameType.해머, "해머")}</Stack>
          <Stack ml="3vw">
            {getScoreComponent(GameType.레크레이션, "레크레이션")}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
