import { Stack, Box } from "@mui/material"
import { useRouter } from "next/router"
import { useRecoilState, useSetRecoilState } from "recoil"
import { SelectedTab, Tabs } from "state/tab"
import Tab from "components/tab"
import Home from "components/home"
import MyPage from "components/myPage"
import useKakaoHook from "kakao"
import { NotificationMessage } from "state/notification"
import { useEffect, useState } from "react"
import { post } from "./api"
import { User } from "@entity/user"
import Etc from "components/etc"

function index() {
  const { push } = useRouter()
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [userInformation, setUserInformation] = useState(new User())
  const setNotificationMessage = useSetRecoilState(NotificationMessage)
  const [selectedTab, setSelectedTab] = useRecoilState(SelectedTab)

  useEffect(() => {
    checkToken()
  }, [])

  async function checkToken() {
    const token = localStorage.getItem("token")
    if (!token) {
      setNotificationMessage("카카오 로그인 이후 이용 가능힙니다.")
      setShowLoginPopup(true)
      return
    }
    const { result, userData } = await post("/auth/check-token", {
      token,
    })
    if (result === "true") {
      setUserInformation(userData)
      return
    }
    setNotificationMessage("카카오 로그인 이후 이용 가능힙니다.")
    setShowLoginPopup(true)
  }

  function render() {
    switch (selectedTab) {
      case Tabs.Home:
        return <Home />
      case Tabs.Etc:
        return <Etc />
      case Tabs.MyPage:
        return <MyPage />
    }
    return <Home />
  }

  function KakaoLoginPopup() {
    const { getKakaoToken } = useKakaoHook()

    async function login() {
      let kakaoToken
      try {
        kakaoToken = await getKakaoToken()
      } catch {
        setNotificationMessage("카카오 로그인 실패")
        return
      }
      try {
        const { token } = await post("/auth/receipt-record", {
          kakaoId: kakaoToken,
        })
        localStorage.setItem("token", token)
        const { result, userData } = await post("/auth/check-token", {
          token,
        })
        if (result === "true") {
          setUserInformation(userData)
          setShowLoginPopup(false)
        } else {
          setNotificationMessage("카카오 로그인 실패")
        }
      } catch {
        setNotificationMessage(
          "서버가 응답하지 않습니다.\n잠시후 다시 시도해주세요."
        )
      }
    }

    return (
      <Stack
        width="100vw"
        height="100vh"
        position="absolute"
        zIndex="40"
        bgcolor="#000000cc"
        direction="row"
        justifyContent="center"
        alignItems="end"
        padding="24px"
      >
        <Stack
          gap="24px"
          fontSize="20px"
          fontWeight="700"
          style={{
            zIndex: 10,
            width: "90%",
            height: "150px",
            padding: "24px",
            bottom: "20px",
            background: "white",
            borderRadius: "12px",
            border: "1px solid black",
            display: "flex",
            alignItems: "center",
          }}
        >
          로그인을 해주세요!
          <img onClick={login} src="/kakao_login.png" />
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      {showLoginPopup && <KakaoLoginPopup />}
      <Box
        style={{
          overflowY: "scroll",
          marginBottom: "60px",
        }}
      >
        {render()}
      </Box>
      <Tab />
    </Stack>
  )
}

export default index
