import { useEffect, useState } from "react"
import {
  Box,
  Button,
  Stack,
  StackProps,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material"
import { User } from "@server/entity/user"
import { useRouter } from "next/router"
import { get } from "pages/api"
import { NotificationMessage } from "state/notification"
import { useSetRecoilState } from "recoil"
import { InOutType } from "@entity/types"
import { InOutInfo } from "@entity/inOutInfo"
import { HowToMove } from "@server/entity/types"

function InoutInfo() {
  const router = useRouter()
  const [allUserList, setAllUserList] = useState<Array<User>>([])
  const [allInoutInfo, setAllInoutInfo] = useState([] as InOutInfo[])
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    ;(async () => {
      try {
        const list = await get("/admin/get-all-user")
        if (list) {
          setAllUserList(list)
        }
      } catch {
        router.push("/admin")
        setNotificationMessage("권한이 없습니다.")
        return
      }
      get("/admin/get-car-info")
        .then((data: InOutInfo[]) => {
          setAllInoutInfo(data)
        })
        .catch(() => {
          router.push("/admin")
          setNotificationMessage("권한이 없습니다.")
          return
        })
    })()
  }, [])

  return (
    <Stack gap="12px" padding="12px">
      <Box>목요일에 교회에서 버스타고 수련회장 가는 인원</Box>
      <Stack direction="row" flexWrap="wrap" gap="12px">
        {allUserList
          .filter((u) => u.howToGo === HowToMove.together)
          .sort((a, b) => a.age - b.age)
          .map((user) => (
            <Stack
              gap="24px"
              width="150px"
              padding="12px"
              direction="row"
              borderRadius="12px"
              bgcolor={user.sex === "man" ? "lightblue" : "pink"}
            >
              <Box>{user.name}</Box>
              <Box>{user.age}</Box>
            </Stack>
          ))}
      </Stack>
      <Box>목요일에 버스가 아닌 이동이 있는 인원</Box>
      <Stack direction="row" flexWrap="wrap" gap="12px">
        {allInoutInfo
          .filter((info) => info.day === 0)
          .sort((a, b) => a.user.age - b.user.age)
          .sort((a, b) => a.time - b.time)
          .map((info) => (
            <Stack
              gap="24px"
              width="300px"
              padding="12px"
              direction="row"
              borderRadius="12px"
              bgcolor={info.user.sex === "man" ? "lightblue" : "pink"}
            >
              <Box>{info.user.name}</Box>
              <Box>{info.user.age}</Box>
              <Box>{info.time}시에</Box>
              <Box>{info.inOutType === InOutType.IN ? "들어감" : "나감"}</Box>
            </Stack>
          ))}
      </Stack>
      <Box>금요일에 버스가 아닌 이동이 있는 인원</Box>
      <Stack direction="row" flexWrap="wrap" gap="12px">
        {allInoutInfo
          .filter((info) => info.day === 1)
          .sort((a, b) => a.user.age - b.user.age)
          .sort((a, b) => a.time - b.time)
          .map((info) => (
            <Stack
              gap="24px"
              width="300px"
              padding="12px"
              direction="row"
              borderRadius="12px"
              bgcolor={info.user.sex === "man" ? "lightblue" : "pink"}
            >
              <Box>{info.user.name}</Box>
              <Box>{info.user.age}</Box>
              <Box>{info.time}시에</Box>
              <Box>{info.inOutType === InOutType.IN ? "들어감" : "나감"}</Box>
            </Stack>
          ))}
      </Stack>
      <Box>토요일에 버스가 아닌 이동이 있는 인원</Box>
      <Stack direction="row" flexWrap="wrap" gap="12px">
        {allInoutInfo
          .filter((info) => info.day === 2)
          .sort((a, b) => a.user.age - b.user.age)
          .sort((a, b) => a.time - b.time)
          .map((info) => (
            <Stack
              gap="24px"
              width="300px"
              padding="12px"
              direction="row"
              borderRadius="12px"
              bgcolor={info.user.sex === "man" ? "lightblue" : "pink"}
            >
              <Box>{info.user.name}</Box>
              <Box>{info.user.age}</Box>
              <Box>{info.time}시에</Box>
              <Box>{info.inOutType === InOutType.IN ? "들어감" : "나감"}</Box>
            </Stack>
          ))}
      </Stack>
    </Stack>
  )
}

export default InoutInfo
