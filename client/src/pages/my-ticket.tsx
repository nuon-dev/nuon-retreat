import { User } from "@entity/user"
import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
//@ts-ignore
import Transition from "react-transition-group/transition"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"
import { post } from "./api"
import useKakaoHook from "kakao"

export default function MyTicket() {
  const [showQrCode, setShowQrCode] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [userInformation, setUserInformation] = useState(new User())
  const setNotificationMessage = useSetRecoilState(NotificationMessage)
  const { getKakaoToken } = useKakaoHook()

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

  function closePopup() {
    setShowQrCode(false)
  }

  const transitionStyles = {
    entering: {
      zIndex: 1,
      opacity: 0,
      transform: "translate(0,0)",
    },
    entered: {
      opacity: 1,
      zIndex: 10,
      transition: "all 0.3s ease-in-out",
      transform: "translate(0,-30%)",
    },
    exiting: {
      opacity: 1,
      zIndex: 10,
      transform: "translate(0,-30%)",
    },
    exited: {
      zIndex: 1,
      opacity: 0,
      transition: "all 0.3s ease-in-out",
      transform: "translate(0,0)",
    },
  }

  function KakaoLoginPopup() {
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
    <Stack zIndex="5">
      {showLoginPopup && <KakaoLoginPopup />}
      <Stack p="24px" gap="12px">
        <Stack fontSize="24px" fontWeight="bold" textAlign="center">
          모바일 티켓
        </Stack>
        <Stack mt="12px" textAlign="center" color="#666">
          2024 새벽이슬 동계 수련회
        </Stack>
        <img
          style={{
            width: "90%",
            marginLeft: "20px",
            borderRadius: "12px",
          }}
          src="/poster.webp"
        />
        <Stack fontSize="24px" fontWeight="bold" textAlign="center">
          2024.02.02 ~ 2024.02.04
        </Stack>
        <Stack fontSize="24px" fontWeight="bold" textAlign="center">
          입장권
        </Stack>
        <Stack color="#666" textAlign="center">
          수원제일교회 새벽이슬 청년부
        </Stack>
        <Stack direction="row" justifyContent="center" gap="12px" color="#333">
          <Box key={userInformation.name}>{userInformation.name}</Box>
          <Box width="1px" height="20px" bgcolor="#ccc" />
          <Box key={userInformation.age}>{userInformation.age}</Box>
          <Box width="1px" height="20px" bgcolor="#ccc" />
          <Box>60,000 (일반)</Box>
          <Box width="1px" height="20px" bgcolor="#ccc" />
          <Box key={userInformation.name + "deposit"}>
            {userInformation.deposit ? "입금 확인" : "입금 대기"}
          </Box>
        </Stack>
        <Stack mt="24px" alignItems="center">
          <Stack
            border="2px solid #ccc"
            borderRadius="12px"
            padding="12px"
            zIndex="5"
            width="100px"
          >
            <img
              style={{
                borderRadius: "12px",
              }}
              src="/icon/free-icon-qr.png"
              onClick={() => {
                setShowQrCode(!showQrCode)
              }}
            />
          </Stack>
        </Stack>
        <Transition in={showQrCode} timeout={0}>
          {(state) => (
            <QrPopup
              qrContent={userInformation.kakaoId || ""}
              //@ts-ignore
              style={transitionStyles[state]}
              closePopup={closePopup}
            />
          )}
        </Transition>
      </Stack>
    </Stack>
  )
}

function QrPopup({
  closePopup,
  qrContent,
  style,
}: {
  closePopup: () => void
  qrContent: string
  style: Object
}) {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    fetchQrValue()
    setInterval(fetchQrValue, 1000 * 10)
  }, [])

  function fetchQrValue() {
    setCurrentTime(new Date().getTime().toString())
  }

  return (
    <Stack
      p="24px"
      pb="40px"
      gap="30px"
      style={style}
      bottom="-10%"
      bgcolor="white"
      width="90%"
      borderRadius="12px"
      boxShadow="0px -5px 20px grey"
      position="fixed"
      fontSize="24px"
      fontWeight="bold"
      onClick={closePopup}
      alignItems="center"
    >
      <Stack
        width="100%"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack>모바일 티켓</Stack>
        <img width="53px" src="/icon/free-icon-close-window.png" />
      </Stack>
      <QRCode
        size={256}
        value={`${qrContent}/${currentTime}`}
        viewBox={`0 0 256 256`}
        style={{ height: "auto", width: "70%" }}
      />
    </Stack>
  )
}
