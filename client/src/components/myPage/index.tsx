import { Box, Stack } from "@mui/material"
import styles from "./index.module.css"
import { useEffect, useState } from "react"
import { User } from "@entity/user"
import { post } from "pages/api"
import JsBarcode from "jsbarcode"

export default function MyPage() {
  const [userInformation, setUserInformation] = useState(new User())

  useEffect(() => {
    checkToken()
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

  const bgcolor = "gray"
  const innerColor = "white"

  return (
    <Stack
      bgcolor={bgcolor}
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        width="300px"
        bgcolor={innerColor}
        borderRadius="12px"
        gap="40px"
        justifyContent="center"
      >
        <Box className={styles["symbol"]}></Box>
        <Box textAlign="center">{userInformation.name}님</Box>
        <Stack direction="row" justifyContent="space-around">
          <Box textAlign="center">
            <Box fontSize="20px" color={bgcolor}>
              200
            </Box>
            <Box fontSize="12px" fontWeight="600">
              총인원
            </Box>
          </Box>
          <Box textAlign="center">
            <Box fontSize="20px" color={bgcolor}>
              {userInformation.id + 100}
            </Box>
            <Box fontSize="12px" fontWeight="600">
              접수번호
            </Box>
          </Box>
          <Box textAlign="center">
            <Box fontSize="20px" color={bgcolor}>
              205호
            </Box>
            <Box fontSize="12px" fontWeight="600">
              방번호
            </Box>
          </Box>
        </Stack>
        <Stack height="60px" alignSelf="center">
          {BarcodeItemScreen("test")}
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            bgcolor={bgcolor}
            width="40px"
            height="40px"
            borderRadius="40px"
            marginLeft="-15px"
          />
          <Box flex={1} height="0.1px" bgcolor="gray" margin="10px" />
          <Box
            bgcolor={bgcolor}
            width="40px"
            height="40px"
            borderRadius="40px"
            marginRight="-15px"
          />
        </Stack>
        <Stack direction="row" justifyContent="space-around" padding="20px">
          <Box>
            <img width="60px" src="./1939.png" />
          </Box>
          <Box>
            <img width="60px" src="./favicon.ico" />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  )
}

const BarcodeItemScreen = (barcodeNumber: string) => {
  const [imageUrl, setImageUrl] = useState<string>()

  useEffect(() => {
    const canvas = document.createElement("canvas")
    JsBarcode(canvas, barcodeNumber, { height: 60, displayValue: false })
    setImageUrl(canvas.toDataURL("image/png"))
  }, [])

  return <div>{imageUrl && <img src={imageUrl} />}</div>
}
