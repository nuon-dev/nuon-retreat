import { Box, Stack } from "@mui/material"
import styles from "./index.module.css"
import { useEffect, useRef, useState } from "react"
import { User } from "@entity/user"
import { post } from "pages/api"
import JsBarcode from "jsbarcode"

export default function MyPage() {
  const imgRef = useRef<HTMLImageElement>({} as any)
  const [userInformation, setUserInformation] = useState(new User())
  const [imgWidth, setImgWidth] = useState(0)

  useEffect(() => {
    checkToken()
    if (!imgRef.current) {
      return
    }
    const imgWidth = imgRef.current.width as number
    setImgWidth(imgWidth)
  }, [])

  const checkToken = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      return
    }
    post("/auth/check-token", {
      token,
    }).then((response) => {
      if (response.result === "true") {
        setUserInformation(response.userData)
      }
    })
  }

  const fontColor = "#254820"

  function calc(value: number) {
    const defaultWidth = 390

    return (value * imgWidth) / defaultWidth + "px"
  }

  return (
    <Stack height="100vh" alignItems="center">
      <img
        ref={imgRef}
        src="./my-page-bg.jpeg"
        width="100%"
        style={{
          position: "absolute",
        }}
      />
      <Stack
        mt={calc(180)}
        width={calc(300)}
        borderRadius="12px"
        zIndex="10"
        justifyContent="center"
      >
        <Box
          className={styles["symbol"]}
          width={calc(72)}
          height={calc(72)}
          mt={calc(-35)}
        ></Box>
        <Stack direction="row" justifyContent="space-around" mt={calc(15)}>
          <Box
            width="80px"
            textAlign="center"
            fontSize="20px"
            fontWeight="bold"
            color={fontColor}
          >
            {userInformation.groupAssignment?.groupNumber}조
          </Box>
          <Box
            width="80px"
            textAlign="center"
            fontSize="20px"
            fontWeight="bold"
            color={fontColor}
          >
            {userInformation.village}
          </Box>
          <Box
            width="80px"
            textAlign="center"
            fontSize="20px"
            fontWeight="bold"
            color={fontColor}
          >
            -호
          </Box>
        </Stack>
        <Stack height={calc(60)} alignSelf="center" mt={calc(50)}>
          {BarcodeItemScreen(userInformation.kakaoId)}
        </Stack>
        <Box
          textAlign="center"
          mt={calc(75)}
          color={fontColor}
          fontWeight="bold"
        >
          {userInformation.name}님
        </Box>
      </Stack>
    </Stack>
  )
}

const BarcodeItemScreen = (barcodeNumber: string) => {
  const [imageUrl, setImageUrl] = useState<string>()

  useEffect(() => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    JsBarcode(canvas, barcodeNumber, { height: 60, displayValue: false })
    setImageUrl(canvas.toDataURL("image/png"))
  }, [])

  return <div>{imageUrl && <img src={imageUrl} />}</div>
}
