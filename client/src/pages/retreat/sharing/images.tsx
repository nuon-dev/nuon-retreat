"use client"

import { Button, Stack } from "@mui/material"
import { SharingImage } from "@server/entity/sharing"
import { get, put, SERVER_FULL_PATH } from "pages/api"
import { useEffect, useState } from "react"

export default function Images() {
  const [openUploadModal, setOpenUploadModal] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [sharingImageList, setSharingImageList] = useState<SharingImage[]>([])

  useEffect(() => {
    getImages()
  }, [])

  useEffect(() => {
    if (!openUploadModal) {
      setImage(null)
    }
  }, [openUploadModal])

  const onChangeImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const file = event.target.files[0]
      if (file && file.type.startsWith("image/")) {
        setImage(file)
      }
    }
  }

  async function saveImage() {
    if (!image) {
      return
    }
    const form = new FormData()
    form.append("image", image)
    const result = await fetch(`${SERVER_FULL_PATH}/retreat/sharing/image`, {
      method: "PUT",
      body: form,
    })

    if (result.status === 200) {
      setOpenUploadModal(false)
      await getImages()
    }
  }

  async function getImages() {
    const data = await get("/retreat/sharing/images")
    setSharingImageList(data)
  }

  return (
    <Stack width="100%">
      <img
        src="/retreat/sharing_bg.jpeg"
        width="100%"
        style={{
          zIndex: 1,
          position: "absolute",
        }}
      />
      <Stack
        p="10px"
        width="40px"
        height="40px"
        textAlign="center"
        alignItems="center"
        zIndex="100"
        position="fixed"
        bottom="0"
        right="0"
        m="20px"
        border="1px solid #ccc"
        borderRadius="30px"
        bgcolor="white"
        onClick={(e) => {
          e.stopPropagation()
          setOpenUploadModal(true)
        }}
      >
        +
      </Stack>
      {openUploadModal && (
        <Stack
          width="100%"
          height="100%"
          zIndex="50"
          position="fixed"
          alignItems="center"
          justifyContent="center"
          onClick={() => setOpenUploadModal(false)}
        >
          <Stack
            width="300px"
            height="400px"
            bgcolor="white"
            borderRadius="10px"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <label htmlFor="imgInput">
              <Stack
                textAlign="center"
                padding="4px"
                margin="12px"
                borderRadius="4px"
                border="1px solid #ccc"
              >
                사진 선택
              </Stack>
            </label>
            <input type="file" hidden id="imgInput" onChange={onChangeImg} />
            <Stack flex="1">
              {image ? (
                <img
                  style={{
                    maxHeight: "280px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                  className="img"
                  src={URL.createObjectURL(image)}
                  alt="image"
                />
              ) : (
                <Stack
                  width="100%"
                  height="100%"
                  textAlign="center"
                  alignItems="center"
                  justifyContent="center"
                >
                  사진을 선택해주세요
                </Stack>
              )}
            </Stack>
            <Button
              variant="contained"
              style={{
                margin: "10px",
              }}
              onClick={saveImage}
            >
              저장하기
            </Button>
          </Stack>
        </Stack>
      )}
      <Stack
        width="100%"
        zIndex="10"
        mt="60%"
        direction="row"
        flexWrap="wrap"
        padding="10px"
        alignItems="center"
        justifyContent="start"
      >
        {sharingImageList.map((image) => (
          <Stack key={image.id} width="80%" margin="10%">
            <img
              width="100%"
              src={`${SERVER_FULL_PATH}/sharing/image/${image.url}`}
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
