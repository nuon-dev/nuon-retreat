import { Box, Button, Stack } from "@mui/material"
import { useRouter } from "next/router"
import { get, post } from "./api"
import useKakaoHook from "kakao"
import { useEffect } from "react"

function index() {
  const router = useRouter()
  const kakao = useKakaoHook()

  useEffect(() => {
    checkToken()
  }, [])

  function checkToken() {
    const token = localStorage.getItem("token")

    if (!token) {
      return
    }

    post("/auth/check-token", {
      token,
    }).then((response) => {
      if (response.result === "true") {
        router.push("/edit")
      }
    })
  }

  async function kakaoLogin() {
    const kakaoToken = await kakao.getKakaoToken()
    const { token } = await post("/auth/receipt-record", {
      kakaoId: kakaoToken,
    })
    localStorage.setItem("token", token)
    router.push("/edit")
  }

  return (
    <Stack
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Stack
        style={{
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          alignItems: "center",
          backgroundRepeat: "round",
        }}
      >
        <Stack
          justifyContent="center"
          alignItems="center"
          style={{
            marginTop: "30vh",
          }}
        >
          <Box textAlign="center" marginY="2rem" fontSize="30px" color="#444">
            태신자 작성
          </Box>
          <Box marginY="20px">(접수를 위해 카카로 로그인이 필요합니다.)</Box>
          <Button
            style={{
              backgroundColor: "#FEE500",
              color: "#191919",
              height: "13vw",
              width: "40vw",
              borderRadius: "12px",
              fontSize: "4vw",
              fontWeight: "bold",
            }}
            onClick={kakaoLogin}
          >
            카카오로 로그인
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default index
