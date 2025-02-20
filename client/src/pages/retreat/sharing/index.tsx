"use client"

import { Box, Button, Stack, TextField } from "@mui/material"
import { useRouter } from "next/router"
import { get, post } from "pages/api"
import { useEffect, useState } from "react"
import { SharingText } from "@server/entity/sharing"
import dayjs from "dayjs"

export default function Sharing() {
  const { push } = useRouter()
  const [sharingMessage, setSharingMessage] = useState("")
  const [sharingTextList, setSharingTextList] = useState<SharingText[]>([])

  useEffect(() => {
    getSharing()
  }, [])

  function goToImagesPage() {
    push("/retreat/sharing/images")
  }

  function goToVideosPage() {
    push("/retreat/sharing/videos")
  }

  async function registerSharing() {
    await post("/retreat/sharing", { content: sharingMessage })
    setSharingMessage("")
    getSharing()
  }

  async function getSharing() {
    const sharing = await get("/retreat/sharing")
    setSharingTextList(sharing)
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
            backgroundImage: "url(/retreat/video.png)",
            backgroundSize: "cover",
            width: "65px",
            height: "65px",
          }}
        />
        <Box
          onClick={goToImagesPage}
          style={{
            backgroundImage: "url(/retreat/image.png)",
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
        bgcolor="white"
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
          <Stack>은혜 나눔 계시판</Stack>
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
          <Stack p="12px" borderRadius="4px" gap="24px" height="100px">
            {sharingTextList.map((sharingText) => (
              <Stack direction="row" alignItems="center" gap="12px">
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
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
