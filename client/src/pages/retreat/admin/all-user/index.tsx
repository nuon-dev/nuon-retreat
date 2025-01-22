import { useEffect, useState } from "react"
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material"
import { get } from "../../../api"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"
import { useRouter } from "next/router"
import { HowToMove } from "@server/entity/types"
import { InOutInfo } from "@server/entity/inOutInfo"
import { RetreatAttend } from "@server/entity/retreatAttend"
import Header from "components/Header"

function AllUser() {
  const router = useRouter()
  const [allUserList, setAllUserList] = useState<Array<RetreatAttend>>([])
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    ;(async () => {
      try {
        const list = await get("/retreat/admin/get-all-user")
        if (list) {
          setAllUserList(list)
        }
      } catch {
        router.push("/retreat/admin")
        setNotificationMessage("권한이 없습니다.")
        return
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

    get("/retreat/admin/get-car-info").then((data: InOutInfo[]) => {
      var hiddenElement = document.createElement("a")
      hiddenElement.href =
        "data:attachment/text," + encodeURI(JSON.stringify(data))
      hiddenElement.target = "_blank"
      hiddenElement.download = "출입 정보.txt"
      hiddenElement.click()
    })
  }

  return (
    <Stack>
      <Header />
      <Stack
        mt="8px"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack
          fontSize="20px"
          fontWeight="bold"
          textAlign="center"
          width="100%"
        >
          전체 사용자 목록
        </Stack>

        {/* <Button
          style={{
            margin: "8px",
          }}
          variant="outlined"
          onClick={downloadFile}
        >
          엑셀로 다운로드
        </Button> */}
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>이름</TableCell>
            <TableCell>성별</TableCell>
            <TableCell>나이</TableCell>
            <TableCell>가는 방법</TableCell>
            <TableCell>오는 방법</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allUserList.map((retreatAttend) => (
            <TableRow>
              <TableCell>{retreatAttend.user.name}</TableCell>
              <TableCell>
                {retreatAttend.user.gender === "man" ? "남" : "여"}
              </TableCell>
              <TableCell>{retreatAttend.user.yearOfBirth}</TableCell>
              <TableCell>
                {retreatAttend.howToGo === HowToMove.together ? "버스" : "기타"}
              </TableCell>
              <TableCell>
                {retreatAttend.howToBack === HowToMove.together
                  ? "버스"
                  : "기타"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  )
}

export default AllUser
