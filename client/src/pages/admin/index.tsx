import { post } from "../../pages/api"
import { useEffect, useState } from "react"
import { Button, Stack } from "@mui/material/index"
import { useRouter } from "next/router"
import useKakaoHook from "kakao"

function admin() {
  const router = useRouter()
  const kakao = useKakaoHook()

  const [isLogin, setIsLogin] = useState(false)

  const goToPage = (path: string) => {
    router.push(`/admin/${path}`)
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    post("/auth/check-token", {
      token,
    }).then((respone) => {
      if (respone.result === "true") {
        setIsLogin(true)
      }
    })
  }, [])

  const menu = () => {
    return (
      <Stack>
        <Stack
          margin="12px"
          display="flex"
          direction="row"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="center"
          gap="8px"
        >
          <Button variant="contained" onClick={() => goToPage("/all-user")}>
            접수자 전체 조회
          </Button>
          <Stack margin="4px" />
          <Button variant="contained" onClick={() => goToPage("/carpooling")}>
            카풀 관리
          </Button>
          <Stack margin="4px" />
          <Button
            variant="contained"
            onClick={() => goToPage("/room-assignment")}
          >
            방배정 관리
          </Button>
          <Stack margin="4px" />
          <Button
            variant="contained"
            onClick={() => goToPage("/group-formation")}
          >
            조배정 관리
          </Button>
          <Stack margin="4px" />
          <Button
            variant="contained"
            onClick={() => goToPage("/permission-manage")}
          >
            권한 관리
          </Button>
          <Stack margin="4px" />
          <Button
            variant="contained"
            onClick={() => goToPage("/deposit-check")}
          >
            입금 확인 처리
          </Button>
          <Stack margin="4px" />
          <Button
            variant="contained"
            onClick={() => goToPage("/edit-user-data")}
          >
            정보수정
          </Button>
          <Stack margin="4px" />
          <Button
            variant="contained"
            onClick={() => goToPage("/edit-group-score")}
          >
            그룹 점수 관리
          </Button>
          <Stack margin="4px" />
          <Button variant="contained" onClick={() => goToPage("/dash-board")}>
            대시보드
          </Button>
        </Stack>
      </Stack>
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

  return <Stack>{isLogin ? menu() : loginForm()}</Stack>
}

export default admin
