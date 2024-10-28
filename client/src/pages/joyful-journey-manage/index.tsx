import { Box, Button, Input, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { useSetRecoilState } from "recoil"
import useKakaoHook from "kakao"
import { get, post } from "pages/api"
import { NotificationMessage } from "state/notification"
import { User } from "@entity/user"

export default function JoyfulJourneyManege() {
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const setNotificationMessage = useSetRecoilState(NotificationMessage)
  const [userData, setUserData] = useState<User | undefined>()
  const [lookForwardTo, setLookForwardTo] = useState(0)
  const [itForSure, setItForSure] = useState(0)

  useEffect(() => {
    checkToken()
  }, [])

  useEffect(() => {
    loadData()
  }, [userData])

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
    setUserData(userData)
    if (!result || result !== "true") {
      setNotificationMessage("카카오 로그인 이후 이용 가능힙니다.")
      setShowLoginPopup(true)
    }
  }

  async function saveData() {
    await post("/joyful-journey-manage", { lookForwardTo, itForSure })
    setNotificationMessage("성공적으로 저장 되었습니다.")
  }

  async function loadData() {
    const { lookForwardTo, itForSure } = await get("/joyful-journey-manage")

    if (lookForwardTo) {
      setLookForwardTo(lookForwardTo)
    }
    if (itForSure) {
      setItForSure(itForSure)
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
        setUserData(userData)
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
        <img
          src="bg_info.jpeg"
          style={{
            position: "fixed",
            height: "100%",
          }}
        />
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
    <Stack>
      {showLoginPopup ? (
        <KakaoLoginPopup />
      ) : (
        <Stack
          direction="column"
          p="24px"
          gap="12px"
          style={{
            marginBottom: "60px",
          }}
        >
          <Box>
            {userData?.village} 마을 / {userData?.darak}
          </Box>
          <Stack gap="8px" direction="row" alignItems="center">
            예상 인원:
            <Input
              value={lookForwardTo}
              onChange={(e) =>
                setLookForwardTo(Number.parseInt(e.target.value))
              }
              type="number"
            />{" "}
            명
          </Stack>
          <Stack gap="8px" direction="row" alignItems="center">
            확정 인원:
            <Input
              value={itForSure}
              onChange={(e) => setItForSure(Number.parseInt(e.target.value))}
              type="number"
            />{" "}
            명
          </Stack>
          <Button variant="outlined" onClick={saveData}>
            저장
          </Button>
          <Box>
            마을과 다락방 명이 잘못 나온다면, <br />
            금준호(010-8768-3842)로 연락주세요
          </Box>
        </Stack>
      )}
    </Stack>
  )
}
