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
import { get, post } from "../../../pages/api"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { NotificationMessage } from "state/notification"
import { useSetRecoilState } from "recoil"

function DepositCheck() {
  const { push } = useRouter()
  const [allUserCount, setAllUserCount] = useState(0)
  const [isShowUnpaid, setIsShowUnpaid] = useState(false)
  const [depositUserCount, setDepositUserCount] = useState(0)
  const [allUserList, setAllUserList] = useState([] as Array<User>)
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    fetchData()
  }, [])

  async function DepositProcessing(userId: number) {
    const result = await post("/admin/deposit-processing", {
      userId,
    })

    if (result.result === "error") {
      alert("오류 발생!")
      return
    }

    fetchData()
  }

  function fetchData() {
    get("/admin/get-all-user")
      .then((data: User[]) => {
        setAllUserCount(data.length)
        setDepositUserCount(data.filter((user) => user.deposit).length)
        if (isShowUnpaid) {
          setAllUserList(data)
          return
        }
        setAllUserList(data.filter((user) => !user.deposit))
      })
      .catch(() => {
        push("/admin")
        setNotificationMessage("권한이 없습니다.")
        return
      })
  }

  function clickFilter() {
    setIsShowUnpaid(!isShowUnpaid)
  }

  useEffect(() => {
    fetchData()
  }, [isShowUnpaid])

  return (
    <Stack padding="4px" alignItems="center">
      <Stack
        alignItems="center"
        justifyContent="space-between"
        gap="12px"
        style={{
          margin: "24px",
        }}
      >
        <Stack fontWeight="600" fontSize="20px">
          전체 / 납부자 ({allUserCount} / {depositUserCount})
        </Stack>
        <Stack fontWeight="500" fontSize="18px">
          예상 납부 금액 -{" "}
          {(depositUserCount * 75000)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          원 ({depositUserCount * 7.5}만원)
        </Stack>

        <Button
          onClick={clickFilter}
          variant="contained"
          style={{
            width: "150px",
          }}
        >
          {isShowUnpaid ? "미납부자만 보기" : "전체보기"}
        </Button>
      </Stack>
      <Table
        style={{
          maxWidth: "500px",
          border: "1px solid #ccc",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell style={{ paddingLeft: "8px" }}>이름</TableCell>
            <TableCell style={{ padding: 0 }}>접수 일자</TableCell>
            <TableCell style={{ padding: 0 }}>전화번호</TableCell>
            <TableCell style={{ padding: 0 }}>입금 처리</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allUserList.map((user) => {
            const createDate = new Date(user.createAt.toString())
            return (
              <TableRow>
                <TableCell
                  style={{
                    padding: 0,
                    paddingTop: "24px",
                    paddingBottom: "24px",
                  }}
                >
                  {user.name}
                </TableCell>
                <TableCell style={{ padding: 0 }}>
                  {`${createDate.getFullYear() - 2000}.${
                    createDate.getMonth() + 1
                  }.${createDate.getDate()} 
                  ${createDate.getHours()}:${createDate.getMinutes()}`}
                </TableCell>
                <TableCell style={{ padding: 0 }}>{user.phone}</TableCell>
                <TableCell style={{ padding: 0 }}>
                  <Button
                    onClick={() => DepositProcessing(user.id)}
                    variant="contained"
                    color={user.deposit ? "error" : "success"}
                  >
                    {user.deposit ? "취소 처리" : "완료 처리"}
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Stack>
  )
}

export default DepositCheck
