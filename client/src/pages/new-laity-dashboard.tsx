import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { get } from "./api"

export default function NewLaityDashBoard() {
  const [allCount, setAllCount] = useState(0)
  const [worryCount, setWorryCount] = useState(0)
  const [confirmCount, setConfirmCount] = useState(0)
  const [allList, setAllList] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { allCount, worryCount, confirmCount, allList } = await get(
      "/new-laity/dashboard"
    )
    setAllCount(allCount)
    setWorryCount(worryCount)
    setConfirmCount(confirmCount)
    setAllList(allList)
  }

  function getStatus(status: number) {
    switch (status) {
      case 0:
        return "고민 중"
      case 1:
        return "참석 확정"
      case 2:
        return "불참 확정"
    }
  }

  return (
    <Stack direction="row">
      <Stack
        margin="8px"
        fontSize="24px"
        style={{
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #ACACAC",
          boxShadow: "2px 2px 5px 3px #ACACAC;",
        }}
        direction="row"
      >
        <Box fontSize="12px" alignSelf="start" mr="8px" mt="2px">
          태신자 작성 수
        </Box>
        <Box fontSize="28px" alignSelf="end">
          {allCount}
        </Box>
      </Stack>
      <Stack
        margin="8px"
        fontSize="24px"
        style={{
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #ACACAC",
          boxShadow: "2px 2px 5px 3px #ACACAC;",
        }}
        direction="row"
      >
        <Box fontSize="12px" alignSelf="start" mr="8px" mt="2px">
          고민 중
        </Box>
        <Box fontSize="28px" alignSelf="end">
          {worryCount}
        </Box>
      </Stack>
      <Stack
        margin="8px"
        fontSize="24px"
        style={{
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #ACACAC",
          boxShadow: "2px 2px 5px 3px #ACACAC;",
        }}
        direction="row"
      >
        <Box fontSize="12px" alignSelf="start" mr="8px" mt="2px">
          확정
        </Box>
        <Box fontSize="28px" alignSelf="end">
          {confirmCount}
        </Box>
      </Stack>

      <Stack gap="2px">
        {allList.map((data) => (
          <Stack border="1px solid black">
            {data.user.name} {data.user.age} - {data.newMemberName}{" "}
            {getStatus(data.status)}
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
