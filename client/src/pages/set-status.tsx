import { Button, Stack } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { post } from "../pages/api"
import useKakaoHook from "kakao"
import { User } from "@entity/user"

export default function SetStatusPage() {
  const router = useRouter()
  const kakao = useKakaoHook()
  const [isLogin, setIsLogin] = useState(false)
  const [userData, setUserData] = useState<User>()
  const { status } = router.query

  useEffect(() => {
    const token = localStorage.getItem("token")
    post("/auth/check-token", {
      token,
    }).then((response) => {
      if (response.result === "true") {
        setUserData(response.userData)
        setIsLogin(true)
      }
    })
  }, [])

  async function kakaoLogin() {
    const kakaoToken = await kakao.getKakaoToken()
    const { token } = await post("/auth/receipt-record", {
      kakaoId: kakaoToken,
    })
    localStorage.setItem("token", token)
    setIsLogin(true)
  }

  if (!isLogin) {
    return (
      <Button
        style={{
          marginTop: "40px",
          backgroundColor: "#FEE500",
          color: "#191919",
          height: "60px",
          width: "240px",
          borderRadius: "12px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
        onClick={kakaoLogin}
      >
        카카오 로그인
      </Button>
    )
  }

  post("/status/set", {
    userId: userData?.id,
    status,
  })
  return (
    <Stack>
      {status}
      {userData?.id}
    </Stack>
  )
}
