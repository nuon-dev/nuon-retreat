import { Button, Stack } from "@mui/material"
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
          backgroundImage: "url(/main_bg.jpeg)",
          backgroundSize: "cover",
          alignItems: "center",
          backgroundRepeat: "round",
        }}
      >
        <Stack
          direction="row"
          style={{
            marginTop: "85vh",
          }}
        >
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
            카카오로 접수하기
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default index
