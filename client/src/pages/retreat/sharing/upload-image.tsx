"use client"

import { Label } from "@mui/icons-material"
import { Button, Stack } from "@mui/material"
import { SharingImage } from "@server/entity/sharing"
import { get } from "pages/api"
import { useEffect, useState } from "react"

export default function UploadImage() {
  const [myImages, setMyImages] = useState<SharingImage[]>([])
  const [image, setImage] = useState<File | null>(null)

  useEffect(() => {
    getMyImages()
  }, [])

  async function getMyImages() {
    const images = await get("/retreat/sharing/images")
    setMyImages(images)
  }

  const onChangeImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const file = event.target.files[0]
      if (file && file.type.startsWith("image/")) {
        setImage(file)
      }
    }
  }

  return (
    <Stack>
      <img
        src="/retreat/sharing_bg.jpeg"
        width="100%"
        style={{
          zIndex: 1,
          position: "absolute",
        }}
      />
      <Stack zIndex="10" pt="60%">
        <Stack>
          <Stack direction="row" gap="24px">
            <label htmlFor="imgInput">사진선택</label>
            <input type="file" hidden id="imgInput" onChange={onChangeImg} />
            <Button variant="contained">저장하기</Button>
          </Stack>
          {myImages.map((image) => (
            <img key={image.id} src={image.url} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}
