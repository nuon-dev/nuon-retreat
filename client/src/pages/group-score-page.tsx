import { Team } from "@entity/teamScore"
import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { get } from "./api"
import { ST } from "next/dist/shared/lib/utils"

interface CustomData {
  sumScore: number
  lastScore: number
  lastRank: number
}

export default function TeamScorePage() {
  const [TeamScoreList, setTeamScoreList] = useState<Array<Team & CustomData>>(
    []
  )
  let isAutoLoad = false

  useEffect(() => {
    fetchData()
    if (isAutoLoad === false) {
      setInterval(fetchData, 1000 * 60)
      isAutoLoad = true
    }
  }, [])

  async function fetchData() {
    const teamList = await get("/admin/team-list")
    const scoreData = teamList.scoreData as Array<Team & CustomData>
    scoreData.forEach(
      (team) =>
        (team.sumScore = team.teamScore
          .sort((a, b) => a.gameNumber - b.gameNumber)
          .reduce((acc, current) => {
            team.lastScore = acc
            return acc + current.score
          }, 0))
    )
    scoreData.sort((a, b) => b.lastScore - a.lastScore)
    scoreData.forEach((score, index) => (score.lastRank = index + 1))
    scoreData.sort((a, b) => b.sumScore - a.sumScore)
    setTeamScoreList(teamList.scoreData)
  }

  const colors = [
    "#F7A3A7",
    "#F7AD97",
    "#FAD892",
    "#C8D7C4",
    "#BBCBD2",
    "#B7B6D6",
    "#E2BBD8",
    "#E55D62",
    "#DB7E6A",
    "#FAAB23",
    "#87B27C",
    "#7DB0C7",
    "#7774B6",
    "#B780A9",
    "#B1A995",
    "#333F4D",
  ]

  return (
    <Stack alignItems="center">
      <Stack
        gap="8px"
        alignItems="center"
        maxWidth="800px"
        minWidth="300px"
        width="100%"
        justifyContent="center"
      >
        <Stack fontSize="24px" mt="24px">
          조별 점수 집계 현황
        </Stack>
        <Stack width="100%" gap="20px" padding="12px">
          {TeamScoreList.map((team, index) => (
            <Stack
              alignItems="center"
              width="100%"
              direction="row"
              justifyContent="space-between"
            >
              <Stack
                direction="row"
                width="70px"
                justifyContent="space-around"
                mr="12px"
              >
                <Stack fontWeight="bold">{index + 1}등</Stack>
                <Stack
                  color={
                    team.lastRank - (index + 1) > 0
                      ? "red"
                      : team.lastRank - (index + 1) === 0
                      ? "grey"
                      : "blue"
                  }
                >
                  {team.lastRank - (index + 1) > 0
                    ? "↑"
                    : team.lastRank - (index + 1) === 0
                    ? ""
                    : "↓"}
                  {team.lastRank - (index + 1)
                    ? Math.abs(team.lastRank - (index + 1))
                    : "-"}{" "}
                </Stack>
              </Stack>
              <Stack
                direction="row"
                width="100%"
                justifyContent="space-between"
                padding="12px"
                borderRadius="12px"
                bgcolor={index < 5 ? colors[index % 6] : "#DDD"}
              >
                <Stack> {team.teamName}</Stack>
                <Stack>
                  {team.teamScore.reduce((acc, current) => {
                    return acc + current.score
                  }, 0)}
                  점
                </Stack>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}
