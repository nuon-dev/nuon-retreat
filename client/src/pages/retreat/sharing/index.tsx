"use client"

import { Box, Button, Stack, TextField } from "@mui/material"
import { useRouter } from "next/router"
import { get, post } from "pages/api"
import { useEffect, useState } from "react"
import { SharingText } from "@server/entity/sharing"
import dayjs from "dayjs"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"
import useUserData from "hooks/useUserData"
import DeleteIcon from "@mui/icons-material/Delete"
import { RetreatAttendAtom } from "state/retreat"
import { User } from "@server/entity/user"

export default function Sharing() {
  const { push } = useRouter()
  const setNotificationMessage = useSetRecoilState(NotificationMessage)
  const retreatData = useRecoilValue(RetreatAttendAtom)
  const [sharingMessage, setSharingMessage] = useState("")
  const [sharingTextList, setSharingTextList] = useState<SharingText[]>([])
  const { getUserDataFromToken, getUserDataFromKakaoLogin } = useUserData()
  const [userData, setUserData] = useState<User>()

  useEffect(() => {
    getSharing()
    checkUserLogin()
  }, [])

  async function checkUserLogin() {
    let userData = await getUserDataFromToken()
    if (!userData) {
      userData = await getUserDataFromKakaoLogin()
      if (!userData) {
        setNotificationMessage("등록을 하기 위해선 로그인이 필요합니다.")
        return
      }
    }
    setUserData(userData)
  }

  function goToImagesPage() {
    push("/retreat/sharing/images")
  }

  function goToVideosPage() {
    push("/retreat/sharing/videos")
  }

  async function registerSharing() {
    setNotificationMessage("등록 되었습니다.")
    await post("/retreat/sharing", { content: sharingMessage })
    setSharingMessage("")
    getSharing()
  }

  async function getSharing() {
    const sharing = await get("/retreat/sharing")
    setSharingTextList(sharing)
  }

  async function deleteSharingText(id: number) {
    await post("/retreat/sharing/delete", { id })
    getSharing()
    setNotificationMessage("삭제 되었습니다.")
  }

  return (
    <Stack alignItems="center" gap="24px" mb="40px">
      <img
        src="/retreat/sharing_bg.png"
        width="100%"
        style={{
          zIndex: 1,
          position: "absolute",
        }}
      />
      <Stack direction="row" gap="24px" mt="60%" zIndex="10">
        <Box
          onClick={goToVideosPage}
          style={{
            backgroundImage: "url(/retreat/youtube.png)",
            backgroundSize: "cover",
            width: "65px",
            height: "65px",
          }}
        />
        <Box
          onClick={goToImagesPage}
          style={{
            backgroundImage: "url(/retreat/photo.png)",
            backgroundSize: "cover",
            width: "65px",
            height: "65px",
          }}
        />
        <Box
          onClick={goToImagesPage}
          style={{
            backgroundImage: "url(/retreat/notion.png)",
            backgroundSize: "cover",
            width: "65px",
            height: "65px",
          }}
        />
        <Box
          onClick={goToImagesPage}
          style={{
            backgroundImage: "url(/retreat/insta.png)",
            backgroundSize: "cover",
            width: "65px",
            height: "65px",
          }}
        />
      </Stack>

      <Stack
        p="24px"
        px="12px"
        borderRadius="12px"
        width="90%"
        gap="12px"
        zIndex="10"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Stack fontWeight="600" fontSize="16px">
          어떤 은혜를 받으셨나요?
        </Stack>
        <Stack gap="12px">
          <textarea
            rows={4}
            placeholder="이번 수련회를 통해 받은 은혜를 나눠주세요"
            value={sharingMessage}
            onChange={(e) => setSharingMessage(e.target.value)}
            style={{
              width: "100%",
              height: "20vh",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "12px",
              resize: "none",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          />
          <Button
            variant="contained"
            onClick={registerSharing}
            sx={{
              borderRadius: "4px",
              bgcolor: "#5D4431",
            }}
          >
            등록하기
          </Button>
        </Stack>
      </Stack>
      <Stack
        width="90%"
        bgcolor="white"
        border="1px solid #ccc"
        borderRadius="12px"
        zIndex="10"
      >
        <Stack
          p="12px"
          width="100%"
          direction="row"
          fontSize="18px"
          fontWeight="500"
          justifyContent="space-between"
        >
          <Stack>은혜 나눔 게시판</Stack>
          <Stack>{sharingTextList.length}</Stack>
        </Stack>
        <Stack
          p="4px"
          pt="10px"
          overflow="scroll"
          width="100%"
          height="300px"
          maxHeight="300px"
          borderTop="1px solid #ccc"
        >
          <Stack px="12px" gap="12px" height="100px" borderRadius="4px">
            {sharingTextList.map((sharingText) => (
              <Stack direction="row" alignItems="center" gap="12px" pb="12px">
                <img
                  src="/profile.jpeg"
                  width="40px"
                  height="40px"
                  style={{
                    borderRadius: "50%",
                  }}
                />
                <Stack direction="column" gap="4px">
                  <Stack direction="row" gap="8px" alignItems="center">
                    <Stack fontWeight="600">{sharingText.writer.name}</Stack>
                    <Stack fontSize="12px" color="grey">
                      {dayjs(sharingText.createAt).format(
                        "YYYY-MM-DD hh:mm:ss"
                      )}
                    </Stack>
                  </Stack>
                  <Stack>{sharingText.content}</Stack>
                </Stack>
                <Stack flex="1" />
                {userData?.id === sharingText.writer.id && (
                  <DeleteIcon
                    fontSize="small"
                    onClick={() => deleteSharingText(sharingText.id)}
                  />
                )}
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
