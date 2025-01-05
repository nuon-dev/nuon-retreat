import { post } from "pages/api"
import { useEffect, useState } from "react"
import { Button, Stack } from "@mui/material/index"
import { useRouter } from "next/router"
import useKakaoHook from "kakao"

//아이콘 주소 https://www.flaticon.com/kr/
function admin() {
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
      >
        <Stack
          width="100%"
          margin="12px"
          display="flex"
          flexWrap="wrap"
          direction="row"
          justifyContent="center"
          gap="20px"
        >
          {pageButton({
            pageName: "접수자 전체 조회",
            pageURL: "/all-user",
            icon: "/icon/free-icon-bullet-list.png",
          })}
          {pageButton({
            pageName: "카풀 관리",
            pageURL: "/carpooling",
            icon: "/icon/free-icon-car.png",
          })}
          {pageButton({
            pageName: "방배정 관리",
            pageURL: "/room-assignment",
            icon: "/icon/free-icon-bunk-bed.png",
          })}
          {pageButton({
            pageName: "조배정 관리",
            pageURL: "/group-formation",
            icon: "/icon/free-icon-group.png",
          })}
          {pageButton({
            pageName: "권한 관리",
            pageURL: "/permission-manage",
            icon: "/icon/free-icon-lock.png",
          })}
          {pageButton({
            pageName: "입금 확인 처리",
            pageURL: "/deposit-check",
            icon: "/icon/free-icon-cost.png",
          })}
          {pageButton({
            pageName: "접수 내용 수정",
            pageURL: "/edit-user-data",
            icon: "/icon/free-icon-edit-profile.png",
          })}
          {pageButton({
            pageName: "인원 확인 처리",
            pageURL: "/check-status",
            icon: "/icon/free-icon-qr-code.png",
          })}
          {pageButton({
            pageName: "인원 관리",
            pageURL: "/show-status-table",
            icon: "/icon/free-icon-table.png",
          })}
          {pageButton({
            pageName: "인원 출입 관리",
            pageURL: "/inout-info",
            icon: "/icon/free-icon-table.png",
          })}
          {pageButton({
            pageName: "대시보드",
            pageURL: "/dash-board",
            icon: "/icon/free-icon-dashboard-interface.png",
          })}
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

  return <Stack py="40px">{isLogin ? menu() : loginForm()}</Stack>
}

export default admin
