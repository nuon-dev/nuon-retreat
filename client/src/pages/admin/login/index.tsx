import { Button } from "@node_modules/@mui/material"
import { useRouter } from "@node_modules/next/router"
import useKakaoHook from "kakao"
import { post } from "pages/api"

export default function AdminLoginPage() {
  const kakao = useKakaoHook()
  const router = useRouter()

  async function kakaoLogin() {
    const kakaoToken = await kakao.getKakaoToken()
    const { token } = await post("/auth/receipt-record", {
      kakaoId: kakaoToken,
    })
    localStorage.setItem("token", token)
    router.push("/admin")
  }

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
