import useKakaoHook from "kakao"
import { useRouter } from "next/router"
import { get, post } from "./api"
import { Box, Button, Stack } from "@mui/material"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"

export default function Info() {
  const { push } = useRouter()
  const kakao = useKakaoHook()
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  async function kakaoLogin() {
    let kakaoToken
    try {
      kakaoToken = await kakao.getKakaoToken()
    } catch {
      setNotificationMessage("카카오 로그인 실패")
      return
    }
    try {
      const { token } = await post("/auth/receipt-record", {
        kakaoId: kakaoToken,
      })
      localStorage.setItem("token", token)
      push("/select-date")
    } catch {
      setNotificationMessage(
        "서버가 응답하지 않습니다.\n잠시후 다시 시도해주세요."
      )
    }
  }

  return (
    <Stack>
      <Stack>
        <img
          style={{
            filter: "blur(5px)",
          }}
          src="/main_bg.webp"
        />
        <Stack
          style={{
            zIndex: 10,
            top: "140px",
            position: "absolute",
          }}
        >
          <img
            style={{
              width: "140px",
              marginLeft: "20px",
            }}
            src="/poster.webp"
          />
        </Stack>
      </Stack>
      <Stack
        style={{
          top: "280px",
          width: "100%",
          position: "absolute",
          backgroundColor: "white",
        }}
      >
        <Stack direction="row" gap="12px" ml="180px" mt="24px">
          <Box
            borderColor="#ffe4d5"
            border="1px solid"
            color="#ff7262"
            padding="4px"
            borderRadius="40px"
            fontWeight="600"
            fontSize="10px"
          >
            단독판매 ▼
          </Box>
          <Box
            padding="4px"
            border="1px solid"
            borderRadius="40px"
            fontWeight="600"
            color="#666"
            fontSize="10px"
          >
            예매대기 ▼
          </Box>
        </Stack>
        <Stack padding="24px" gap="8px">
          <Stack fontWeight="700">
            내 귀에 들린 대로 행하리니 &lt; 민 14 : 28 &gt;
          </Stack>
          <Stack direction="row" gap="12px">
            <Stack direction="row" color="orange">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </Stack>
            <span style={{ fontWeight: "400" }}>10.0</span>
          </Stack>
          <Stack direction="row" alignItems="center" gap="12px">
            <img src="/point.png" style={{ width: "20px" }} />
            <span style={{ fontSize: "14px" }}>여주 중앙 청소년 수련원</span>
          </Stack>
          <Stack direction="row" alignItems="center" gap="12px" mt="-4px">
            <img src="/calendal.png" style={{ width: "20px" }} />
            <span style={{ fontSize: "14px" }}>2024.02.02 ~ 04 (금~일)</span>
          </Stack>
          <Stack mt="12px">
            <img src="/map.webp" />
          </Stack>
          <Stack>
            <Button
              onClick={kakaoLogin}
              variant="contained"
              style={{
                backgroundColor: "#5eaaef",
                height: "60px",
                borderRadius: "12px",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              예매하기
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
