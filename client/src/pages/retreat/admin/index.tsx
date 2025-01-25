import { post } from "pages/api"
import { useEffect, useState } from "react"
import { Button, Stack } from "@mui/material/index"
import { useRouter } from "next/router"
import useKakaoHook from "kakao"
import Header from "../../../components/Header"

//아이콘 주소 https://www.flaticon.com/kr/
export default function Admin() {
  const router = useRouter()
  const kakao = useKakaoHook()

  const [isLogin, setIsLogin] = useState(false)

  const goToPage = (path: string) => {
    router.push(`/retreat/admin${path}`)
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    post("/auth/check-token", {
      token,
    }).then((response) => {
      if (response.result === "true") {
        setIsLogin(true)
      }
    })
  }, [])

  function pageButton({
    pageURL,
    pageName,
    icon,
  }: {
    pageURL: string
    pageName: string
    icon: string
  }) {
    return (
      <Stack
        style={{
          cursor: "pointer",
        }}
        justifyContent="center"
        onClick={() => goToPage(pageURL)}
      >
        <Stack
          width="100px"
          height="100px"
          borderRadius="12px"
          alignItems="center"
          justifyContent="center"
          border="1px solid #333"
        >
          <img style={{ maxWidth: "80px", maxHeight: "80px" }} src={icon} />
        </Stack>
        <Stack mt="4px" textAlign="center">
          {pageName}
        </Stack>
      </Stack>
    )
  }

  const menu = () => {
    return (
      <Stack
        height="100vh"
        alignItems="center"
        width="100%"
        justifyContent="center"
      ></Stack>
    )
  }

  async function kakaoLogin() {
    const kakaoToken = await kakao.getKakaoToken()
    const { token } = await post("/auth/receipt-record", {
      kakaoId: kakaoToken,
    })
    localStorage.setItem("token", token)
    setIsLogin(true)
  }

  const loginForm = () => {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        padding="6px"
        margin="20px"
      >
        준비팀 화면
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
      </Stack>
    )
  }

  return (
    <Stack py="40px">
      <Header />
      {isLogin ? menu() : loginForm()}
    </Stack>
  )
}
