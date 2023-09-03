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
import { get, post } from "../../pages/api"
import { useEffect, useState } from "react"

function DepositCheck() {
  const [allUserCount, setAllUserCount] = useState(0)
  const [isShowUnpaid, setIsShowUnpaid] = useState(false)
  const [depositUserCount, setDepositUserCount] = useState(0)
  const [allUserList, setAllUserList] = useState([] as Array<User>)

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
    get("/admin/get-all-user").then((data: User[]) => {
      setAllUserCount(data.length)
      setDepositUserCount(data.filter((user) => user.deposit).length)
      if (isShowUnpaid) {
        setAllUserList(data)
        return
      }
      setAllUserList(data.filter((user) => !user.deposit))
    })
  }

  function clickFilter() {
    setIsShowUnpaid(!isShowUnpaid)
  }

  useEffect(() => {
    fetchData()
  }, [isShowUnpaid])

  return (
    <Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        style={{
          margin: "24px",
        }}
      >
        <Button
          onClick={clickFilter}
          variant="contained"
          style={{
            width: "150px",
          }}
        >
          {isShowUnpaid ? "전체보기" : "미납부자만 보기"}
        </Button>
        <Stack fontWeight="600" fontSize="20px">
          전체 / 납부자 ({allUserCount} / {depositUserCount})
        </Stack>
        <Stack fontWeight="500" fontSize="18px">
          예상 납부 금액 -{" "}
          {(depositUserCount * 50000)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          원 ({depositUserCount * 5}만원)
        </Stack>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>이름</TableCell>
            <TableCell>참석 유형</TableCell>
            <TableCell>접수 일자</TableCell>
            <TableCell>전화번호</TableCell>
            <TableCell>입금 유무</TableCell>
            <TableCell>입금 처리</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allUserList.map((user) => {
            const createDate = new Date(user.createAt.toString())
            return (
              <TableRow>
                <TableCell>{user.name}</TableCell>
                <TableCell>
                  {`${createDate.getFullYear()}-${
                    createDate.getMonth() + 1
                  }-${createDate.getDate()} ${createDate.getHours()}:${createDate.getMinutes()}:${createDate.getSeconds()}`}
                </TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.deposit ? "Y" : "N"}</TableCell>
                <TableCell>
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
