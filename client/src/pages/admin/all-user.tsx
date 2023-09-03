import { useEffect, useState } from "react"
import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material"
import { User } from "@entity/user"
import { get } from "../../pages/api"
import { InOutInfo } from "@entity/inOutInfo"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"
import Router, { useRouter } from "next/router"
import { HowToGo } from "types"

function AllUser() {
  const router = useRouter()
  const [allUserList, setAllUserList] = useState<Array<User>>([])
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    ;(async () => {
      const list = await get("/admin/get-all-user")
      if (list.error) {
        router.push("/admin")
        setNotificationMessage("권한이 없습니다.")
        return
      }
      if (list) {
        setAllUserList(list)
      }
    })()
  }, [])

  function downloadFile() {
    if (allUserList.length === 0) {
      setNotificationMessage("접수자가 없습니다!.")
      return
    }

    const keys = Object.keys(allUserList[0])
    var textToSave = allUserList
      .map((user) => Object.values(user).join(","))
      .join("\n")

    var hiddenElement = document.createElement("a")
    hiddenElement.href =
      "data:attachment/text," + encodeURI(keys + "\n" + textToSave)
    hiddenElement.target = "_blank"
    hiddenElement.download = "전체 접수자.csv"
    hiddenElement.click()

    get("/admin/get-car-info").then((data: InOutInfo[]) => {
      var hiddenElement = document.createElement("a")
      hiddenElement.href =
        "data:attachment/text," + encodeURI(JSON.stringify(data))
      hiddenElement.target = "_blank"
      hiddenElement.download = "출입 정보.txt"
      hiddenElement.click()
    })
  }

  return (
    <Stack m="8px">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack />
        <Stack fontSize="20px" fontWeight="bold">
          전체 사용자 목록
        </Stack>
        <Button
          style={{
            margin: "8px",
          }}
          variant="outlined"
          onClick={downloadFile}
        >
          엑셀로 다운로드
        </Button>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>이름</TableCell>
            <TableCell>성별</TableCell>
            <TableCell>나이</TableCell>
            <TableCell>버스 이동 유무</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allUserList.map((user) => (
            <TableRow>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.sex === "man" ? "남" : "여"}</TableCell>
              <TableCell>{user.age}</TableCell>
              <TableCell>
                {user.howToGo === HowToGo.together ? "버스" : "기타"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  )
}

export default AllUser
