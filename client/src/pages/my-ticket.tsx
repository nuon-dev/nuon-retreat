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

  //여자
  //1번방 = 201호 ~ 22번방 = 222호
  //23번방 = 313호, 24번방 = 312, 25번방 311호,
  //26번방, 27번 준비팀방1,2
  //28번방 = 318호
  //29번방 = 310호
  const roomW = {
    1: 201,
    2: 202,
    3: 203,
    4: 204,
    5: 205,
    6: 206,
    7: 207,
    8: 208,
    9: 209,
    10: 210,
    11: 211,
    12: 212,
    13: 213,
    14: 214,
    15: 215,
    16: 216,
    17: 217,
    18: 218,
    19: 219,
    20: 220,
    21: 221,
    22: 222,
    23: 301,
    24: 302,
    25: 303,
    26: 304,
    30: 311,
    31: "준비팀 1",
    32: "준비팀 2",
  }

  //남자
  //1~4번방 = 301~304호, 5번방 = 418호 ~ 10번 = 413호
  //22번방 = 412호 ~ 11번 401호,
  //23번방 = 305호, 24번방 306호
  //27~28번방 준비팀
  //29번방 = 320호
  //30번방 = 319호
  const roomM = {
    1: 401,
    2: 402,
    3: 403,
    4: 404,
    5: 405,
    6: 406,
    7: 407,
    8: 408,
    9: 409,
    10: 410,
    11: 411,
    12: 412,
    13: 413,
    14: 414,
    15: 415,
    16: 416,
    17: 417,
    18: 418,
    19: 314,
    20: 315,
    21: 316,
    22: 317,
    23: 318,
    24: 319,
    25: 320,
    29: 313,
    30: 312,
    31: "준비팀 1",
    32: "준비팀 2",
  }

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
          입장권
        </Stack>
        <Stack fontSize="18px" fontWeight="bold" textAlign="center">
          2024.02.02 ~ 2024.02.04
        </Stack>
        <Stack color="#666" textAlign="center">
          수원제일교회 새벽이슬 청년부
        </Stack>
        {userInformation.id && (
          <Stack
            direction="row"
            justifyContent="center"
            gap="12px"
            color="#333"
          >
            <Box key={userInformation.name}>{userInformation.name}</Box>
            <Box width="1px" height="20px" bgcolor="#ccc" />
            <Box key={userInformation.id}>
              {userInformation.groupAssignment.groupNumber}조
            </Box>
            <Box width="1px" height="20px" bgcolor="#ccc" />
            <Box key={userInformation.id}>
              {userInformation.sex === "man"
                ? //@ts-ignore
                  roomM[userInformation.roomAssignment.roomNumber]
                : //@ts-ignore
                  roomW[userInformation.roomAssignment.roomNumber]}
              호
            </Box>
          </Stack>
        )}
        <Stack mt="24px" alignItems="center">
          <Stack
            zIndex="5"
            width="150px"
            padding="12px"
            borderRadius="12px"
            border="2px solid #ccc"
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
            <Box style={{ whiteSpace: "pre" }} mt="12px" fontWeight="500">
              눌러서 입장 QR 확인
            </Box>
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
