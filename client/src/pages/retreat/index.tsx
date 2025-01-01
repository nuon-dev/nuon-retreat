"use client"

import { post } from "../api"
import useKakaoHook from "kakao"
import { Stack, Box } from "@mui/material"
import { useEffect, useState } from "react"
import { SelectedTab } from "state/tab"
import { NotificationMessage } from "state/notification"
import { useRecoilValue, useSetRecoilState } from "recoil"
import MyContent from "components/MyContent"

function index() {
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const setNotificationMessage = useSetRecoilState(NotificationMessage)
  const selectedTab = useRecoilValue(SelectedTab)

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
    const { result } = await post("/auth/check-token", {
      token,
    })
    if (!result || result !== "true") {
      setNotificationMessage("카카오 로그인 이후 이용 가능힙니다.")
      setShowLoginPopup(true)
    }
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
        direction="row"
        justifyContent="center"
        alignItems="end"
        style={{ zIndex: 2000 }}
      >
        <Stack
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            backgroundColor: "#00000055",
          }}
        />
        <Stack
          gap="24px"
          margin="24px"
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
        backgroundColor: "rgb(190, 205, 222)",
      }}
    >
      {showLoginPopup ? <KakaoLoginPopup /> : <Box style={{}}></Box>}
      <MyContent content="핸드폰 크기마다 다름" time="23:14" />
      <MyContent content="핸드폰 크기마다 다름" time="23:14" />
    </Stack>
  )
}

export default index
