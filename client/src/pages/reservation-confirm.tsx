import styled from "@emotion/styled"
import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { post } from "./api"
import { User } from "@entity/user"
import { HowToMove } from "@entity/types"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"

export default function ReservationConfirm() {
  const [userInformation, setUserInformation] = useState(new User())
  const setNotificationMessage = useSetRecoilState(NotificationMessage)
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

  function getMoveTypeString(howToMove: HowToMove) {
    switch (howToMove) {
      case HowToMove.driveCarAlone:
        return "자차 (카풀 불가)"
      case HowToMove.driveCarWithPerson:
        return "자차 (카풀 가능)"
      case HowToMove.goAlone:
        return "대중교통 (여주역)"
      case HowToMove.etc:
        return "기타 (하단에 메모)"
      case HowToMove.rideCar:
        return "카풀 신청 (시간, 장소 기타사항에)"
      case HowToMove.together:
        return "교회 버스로"
    }
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
          src="/poster.webp"
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
        <Stack p="12px" gap="12px">
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
              <CopyToClipboard
                text="3333200247760 카카오뱅크"
                onCopy={() => {
                  setNotificationMessage("계좌 번호가 복사 되었습니다.")
                }}
              >
                <Stack>
                  <span>카카오뱅크 : 3333200247760 (성은비)</span>
                  <span
                    style={{
                      fontSize: "12px",
                      lineHeight: "20px",
                    }}
                  >
                    (클릭하면 복사됩니다.)
                  </span>
                </Stack>
              </CopyToClipboard>
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
            <span>
              2024.02.0{userInformation.whenIn} ~<br /> 2024.02.04 (
              {userInformation.whenIn?.startsWith("2") ? "금" : "토"} ~ 일)
            </span>
          </Stack>
          <Stack direction="row">
            <TableLabel>장소</TableLabel>
            <span>여주중앙청소년수련원</span>
          </Stack>
          <Stack direction="row">
            <TableLabel>수련회 이동 방법</TableLabel>
            <span>{getMoveTypeString(userInformation.howToGo)}</span>
          </Stack>
          <Stack direction="row">
            <TableLabel>교회 이동 방법</TableLabel>
            <span>
              {userInformation.howToLeave === HowToMove.together
                ? "버스"
                : "기타 (자차 및 카풀)"}
            </span>
          </Stack>
          <Stack direction="row">
            <TableLabel>티켓 수량</TableLabel>
            <span>1매</span>
          </Stack>
          <Stack direction="row">
            <TableLabel>수정 가능일</TableLabel>
            <span>2024.01.28 까지</span>
          </Stack>
          <Stack direction="row">
            <TableLabel>입금 확인 유무</TableLabel>
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
  width: 150px;
`
