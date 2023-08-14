import { GroupScore } from "@entity/groupScore"
import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { get } from "./api"

interface CustomData {
  sumScore: number
}

export default function GroupScorePage() {
  const [groupScoreList, setGroupScoreList] = useState<Array<GroupScore>>([])
  let isAutoLoad = false

  useEffect(() => {
    fetchData()
    if (isAutoLoad === false) {
      setInterval(fetchData, 1000 * 10)
      isAutoLoad = true
    }
  }, [])

  async function fetchData() {
    const groupList = await get("/admin/group-list")
    const scoreData = groupList.scoreData as Array<GroupScore & CustomData>
    scoreData.forEach(
      (group) =>
        (group.sumScore = group.groupScore.reduce((acc, current) => {
          return acc + current.score
        }, 0))
    )
    console.log(scoreData.sort((a, b) => b.sumScore - a.sumScore))
    setGroupScoreList(groupList.scoreData)
  }

  return (
    <Stack>
      <Stack gap="8px" alignItems="center">
        {groupScoreList.map((group, index) => (
          <Stack direction="row" alignItems="center" gap="20px">
            <Stack fontWeight="bold">{index + 1}등</Stack>
            <Stack width="50px"> {group.groupName}</Stack>
            <Stack>
              {group.groupScore.reduce((acc, current) => {
                return acc + current.score
              }, 0)}
              점
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
