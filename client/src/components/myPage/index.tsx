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

  const defaultWidth = 390
  function calc(value: number) {
    return (value * imgWidth) / defaultWidth + "px"
  }

  const room = {
    man: {
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
    },
    woman: {
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
      19: 301,
      20: 302,
      21: 303,
      22: 304,
      23: 305,
      24: 306,
      25: 307,
      26: 308,
      27: 309,
      28: 310,
      29: 311,
      30: 312,
      31: 313,
      33: "준비팀1",
      34: "준비팀2",
      35: "준비팀3",
    },
  }

  const BarcodeItemScreen = (barcodeNumber: string) => {
    const [imageUrl, setImageUrl] = useState<string>()

    useEffect(() => {
      const canvas = document.createElement("canvas")
      JsBarcode(canvas, barcodeNumber, {
        height: (70 * imgWidth) / defaultWidth,
        displayValue: false,
      })
      setImageUrl(canvas.toDataURL("image/png"))
    }, [barcodeNumber])

    return <div>{imageUrl && barcodeNumber && <img src={imageUrl} />}</div>
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
            {userInformation.sex &&
              //@ts-ignore
              room[userInformation.sex][
                userInformation.roomAssignment?.roomNumber
              ]}
            호
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
