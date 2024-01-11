import useKakaoHook from "kakao"
import { useRouter } from "next/router"
import { get, post } from "./api"
import { Box, Button, Stack } from "@mui/material"

export default function Info() {
  const { push } = useRouter()
  const kakao = useKakaoHook()

  async function kakaoLogin() {
    const kakaoToken = await kakao.getKakaoToken()
    const { token } = await post("/auth/receipt-record", {
      kakaoId: kakaoToken,
    })
    localStorage.setItem("token", token)
    push("/select-date")
  }

  return (
    <Stack>
      <Stack>
        <img
          style={{
            filter: "blur(5px)",
          }}
          src="/main_bg.jpg"
        />
        <Stack
          style={{
            zIndex: 10,
            top: "120px",
            position: "absolute",
          }}
        >
          <img
            style={{
              width: "120px",
              marginLeft: "20px",
            }}
            src="/main_bg.jpg"
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
        <Stack direction="row" gap="12px" ml="160px" mt="24px">
          <Box
            borderColor="#ffe4d5"
            border="1px solid"
            color="#ff7262"
            padding="2px"
            borderRadius="4px"
            fontWeight="600"
            fontSize="12px"
          >
            단독판매 ▼
          </Box>
          <Box
            padding="2px"
            border="1px solid"
            borderRadius="4px"
            fontWeight="600"
            color="#666"
            fontSize="12px"
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
            <img src="./point.png" style={{ width: "30px" }} />
            <span style={{ fontWeight: "600" }}>여주 중앙 청소년 수련원</span>
          </Stack>
          <Stack direction="row" alignItems="center" gap="12px">
            <img src="./calendal.png" style={{ width: "30px" }} />
            <span style={{ fontWeight: "600" }}>2024.02.02 ~ 04 (금~일)</span>
          </Stack>
          <Stack mt="12px">
            <img src="./map.png" />
          </Stack>
          <Stack>
            <Button
              onClick={kakaoLogin}
              variant="contained"
              style={{
                backgroundColor: "#2350c0",
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
