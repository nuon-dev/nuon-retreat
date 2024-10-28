import { Box, Button, Input, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { useSetRecoilState } from "recoil"
import { get } from "pages/api"
import { NotificationMessage } from "state/notification"
import _ from "lodash"

export default function JoyfulJourneyManege() {
  const setNotificationMessage = useSetRecoilState(NotificationMessage)
  const [dataMap, setDataMap] = useState<any>()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const dataList = await get("/joyful-journey-manage-full")
    const data = dataList.map((data: any) => ({ ...data, ...data.user }))
    const groupBy = _.groupBy(data, (data) => {
      return data.village
    })
    setDataMap(groupBy)
  }
  if (!dataMap) {
    return <></>
  }
  const list = Object.entries(dataMap).map(
    ([key, value]: [key: string, value: [any]]) => {
      return value.reduce(
        (acc, current) => {
          return {
            key,
            lookForwardTo: acc.lookForwardTo + current.lookForwardTo,
            itForSure: acc.itForSure + current.itForSure,
          }
        },
        { key, lookForwardTo: 0, itForSure: 0 }
      )
    }
  )

  const { lookForwardTo, itForSure } = list.reduce(
    (acc, current) => {
      return {
        lookForwardTo: acc.lookForwardTo + current.lookForwardTo,
        itForSure: acc.itForSure + current.itForSure,
      }
    },
    { lookForwardTo: 0, itForSure: 0 }
  )

  return (
    <Stack gap="12px" padding="12px">
      <Box>총 참석 예정 인원 {lookForwardTo} 명</Box>
      <Box>총 참석 확정 인원 {itForSure} 명</Box>
      {list.map((e) => {
        return (
          <Stack>
            <Box>{e.key}</Box>
            {e.lookForwardTo} 명 예정 / {e.itForSure}명 확정
          </Stack>
        )
      })}
    </Stack>
  )
}
