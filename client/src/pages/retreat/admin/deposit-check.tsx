import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material"
import { get, post } from "../../../pages/api"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { NotificationMessage } from "state/notification"
import { useSetRecoilState } from "recoil"
import { RetreatAttend } from "@server/entity/retreatAttend"
import { Deposit } from "@server/entity/types"

function DepositCheck() {
  const { push } = useRouter()
  const [allUserCount, setAllUserCount] = useState(0)
  const [isShowUnpaid, setIsShowUnpaid] = useState(false)
  const [depositStudentCount, setDepositStudentCount] = useState(0)
  const [depositWorkerCount, setDepositWorkerCount] = useState(0)
  const [allUserList, setAllUserList] = useState([] as Array<RetreatAttend>)
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    fetchData()
  }, [])

  async function DepositProcessing(
    retreatAttendId: number,
    isDeposited: Deposit
  ) {
    console.log(retreatAttendId, isDeposited)
    const result = await post("/retreat/admin/deposit-processing", {
      retreatAttendId,
      isDeposited,
    })

    if (result.result === "error") {
      alert("오류 발생!")
      return
    }

    fetchData()
  }

  function fetchData() {
    get("/retreat/admin/get-all-user")
      .then((data: RetreatAttend[]) => {
        setAllUserCount(data.length)
        setDepositStudentCount(
          data.filter(
            (retreatAttend) => retreatAttend.isDeposited === Deposit.student
          ).length
        )
        setDepositWorkerCount(
          data.filter(
            (retreatAttend) => retreatAttend.isDeposited === Deposit.business
          ).length
        )
        if (isShowUnpaid) {
          setAllUserList(data)
          return
        }
        setAllUserList(
          data.filter(
            (retreatAttend) => retreatAttend.isDeposited === Deposit.none
          )
        )
      })
      .catch(() => {
        push("/retreat/admin")
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
          전체 / 납부자 ({allUserCount} /{" "}
          {depositStudentCount + depositWorkerCount})
        </Stack>
        <Stack fontWeight="500" fontSize="18px">
          예상 납부 금액 -{" "}
          {(depositStudentCount * 70000 + depositWorkerCount * 100000)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          원 ({depositStudentCount * 7 + depositWorkerCount * 10}만원)
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
          maxWidth: "800px",
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
          {allUserList.map((retreatAttend) => {
            const createDate = new Date(retreatAttend.createAt.toString())
            return (
              <TableRow key={retreatAttend.id}>
                <TableCell
                  style={{
                    padding: 0,
                    paddingTop: "24px",
                    paddingBottom: "24px",
                  }}
                >
                  {retreatAttend.user.name}
                </TableCell>
                <TableCell style={{ padding: 0 }}>
                  {`${createDate.getFullYear() - 2000}.${
                    createDate.getMonth() + 1
                  }.${createDate.getDate()} 
                  ${createDate.getHours()}:${createDate.getMinutes()}`}
                </TableCell>
                <TableCell style={{ padding: 0 }}>
                  {retreatAttend.user.phone}
                </TableCell>
                <TableCell style={{ padding: "12px" }}>
                  {retreatAttend.isDeposited === Deposit.none ? (
                    <Stack gap="8px">
                      <Button
                        onClick={() =>
                          DepositProcessing(retreatAttend.id, Deposit.student)
                        }
                        variant="contained"
                        color="success"
                      >
                        학생
                      </Button>
                      <Button
                        onClick={() =>
                          DepositProcessing(retreatAttend.id, Deposit.business)
                        }
                        variant="contained"
                        color="success"
                      >
                        직장인
                      </Button>
                    </Stack>
                  ) : (
                    <Button
                      onClick={() =>
                        DepositProcessing(retreatAttend.id, Deposit.none)
                      }
                      variant="contained"
                      color="error"
                    >
                      {retreatAttend.isDeposited === Deposit.student
                        ? "학생"
                        : "직장인"}
                      <br />
                      취소 처리
                    </Button>
                  )}
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
