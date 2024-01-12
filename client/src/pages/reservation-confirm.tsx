import styled from "@emotion/styled"
import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { post } from "./api"
import { User } from "@entity/user"

export default function ReservationConfirm() {
  const [userInformation, setUserInformation] = useState(new User())
  useEffect(() => {
    checkToken()
  }, [])

  const checkToken = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      return
    }
    post("/auth/check-token", {
      token,
    }).then((response) => {
      if (response.result === "true") {
        setUserInformation(response.userData)
      }
    })
  }

  return (
    <Stack>
      <Stack>
        <img
          style={{
            position: "absolute",
            top: "-300px",
            width: "100%",
            filter: "blur(5px)",
          }}
          src="/poster.jpeg"
        />
        <Stack color="white">000</Stack>
        <Stack zIndex="10" color="#333" padding="12px" fontWeight="600">
          <span>내 귀에 들린 대로 행하리니 [민 14 : 28]</span>
          <span
            style={{ fontWeight: "600", color: "#aaa", lineHeight: "30px" }}
          >
            여주 중앙 청소년 수련원
          </span>
        </Stack>
      </Stack>
      <Stack bgcolor="white" zIndex="10" width="100%" gap="12px">
        <Stack p="12px">
          <Stack textAlign="center" fontSize="20px" fontWeight="600">
            예매 확인 / 취소
          </Stack>
          <Stack direction="row" gap="12px">
            <Box color="white" bgcolor="black" p="10px">
              예매완료
            </Box>
            <Stack fontWeight="700">
              [내 귀에 들린 대로 행하리니]
              <br />
              &lt;민 14: 28&gt;
            </Stack>
          </Stack>
        </Stack>
        <Box width="100%" height="1px" bgcolor="#ccc" />
        <Stack gap="12px" px="24px" py="12px">
          <Stack gap="12px">
            <span
              style={{
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              입금 계좌
            </span>
            <span
              style={{
                fontWeight: "600",
                marginLeft: "12px",
              }}
            >
              카카오뱅크 : 3333200247760 (성은비)
            </span>
          </Stack>
          <Stack gap="12px">
            <span
              style={{
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              결제 금액
            </span>
            <span
              style={{
                fontWeight: "600",
                marginLeft: "12px",
              }}
            >
              60,000 원
            </span>
          </Stack>
        </Stack>
        <Box width="100%" height="1px" bgcolor="#ccc" />
        <Stack p="24px" gap="6px">
          <Stack direction="row">
            <TableLabel>예매자</TableLabel>
            <span>{userInformation.name}</span>
          </Stack>
          <Stack direction="row">
            <TableLabel>이용일자</TableLabel>
            <span>2024.02.02~04 (금~일)</span>
          </Stack>
          <Stack direction="row">
            <TableLabel>장소</TableLabel>
            <span>여주중앙청소년수련원</span>
          </Stack>
          <Stack direction="row">
            <TableLabel>티켓 수량</TableLabel>
            <span>1매</span>
          </Stack>
          <Stack direction="row">
            <TableLabel>수정 가능일</TableLabel>
            <span>2024.01.28</span>
          </Stack>
          <Stack direction="row">
            <TableLabel>현재 상태</TableLabel>
            <span>{userInformation.deposit ? "입금 완료" : "입금 대기중"}</span>
          </Stack>
        </Stack>
      </Stack>
      <Box width="100%" height="1px" bgcolor="#ccc" />
      <Stack p="24px" gap="4px" color="#666">
        <span>유의사항</span>
        <span>1. 예매 하신 후에 입금 까지 완료해주셔야 정상 처리가 됩니다</span>
        <span>
          2. 입금 완료는 입금 계좌에 입금된 2~3일 후 완료될 예정입니다
        </span>
      </Stack>
      <Stack
        p="24px"
        color="#666"
        direction="row"
        justifyContent="space-between"
      >
        <span>문의사항</span>
        <span>
          조영래(010-7350-5664)
          <br />
          성은비(010-5036-9706)
        </span>
      </Stack>
    </Stack>
  )
}

const TableLabel = styled.span`
  width: 100px;
`