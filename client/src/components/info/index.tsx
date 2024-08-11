import { Button, Stack } from "@mui/material"
import styles from "./index.module.css"
import { useEffect, useRef, useState } from "react"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"

export default function Info() {
  const imgRef = useRef<HTMLImageElement>()
  const setNotificationMessage = useSetRecoilState(NotificationMessage)
  const [showDownloadPopup, setShowDownloadPopup] = useState(false)

  const [imgWidth, setImgWidth] = useState(0)

  useEffect(() => {
    if (!imgRef.current) {
      return
    }
    const imgWidth = imgRef.current.width as number
    setImgWidth(imgWidth)
  }, [])

  function calc(value: number) {
    const defaultWidth = 390

    return (value * imgWidth) / defaultWidth
  }

  function forReady() {
    setNotificationMessage("준비중 입니다.")
  }

  function onClickPoster() {
    setShowDownloadPopup(true)
  }

  function DownloadPopup() {
    function downloadFile(e: any, index: number) {
      e.stopPropagation()
      const files = [
        "word_notes.pdf",
        "P20240716_223129000_E07A8DD3-CBF4-4105-A326-19A7C724BA12.JPG",
        "P20240716_223129000_F20057DC-3386-4C7E-911D-09EB4BAC36D7.JPG",
        "P20240717_200239000_44C46409-6D63-4200-B115-4F6655841989.JPG",
        "P20240717_200239000_EFFFC8E1-1776-4B74-AAA5-E46ED8ECC678.JPG",
      ]

      const fileName = files[index]
      var pom = document.createElement("a")
      // file 폴더의 파일을 다운로드
      var filePath = "/" + encodeURIComponent(fileName)
      pom.setAttribute("type", "application/octet-stream;charset=utf-8")
      pom.setAttribute("href", filePath)
      pom.setAttribute("download", fileName)
      pom.click()
      pom.remove()
    }

    return (
      <Stack
        width="100vw"
        height="100vh"
        zIndex="100"
        position="fixed"
        alignItems="center"
        justifyContent="center"
        onClick={() => setShowDownloadPopup(false)}
      >
        <Stack
          gap="16px"
          width="300px"
          padding="24px"
          bgcolor="#2d422add"
          borderRadius="24px"
        >
          <Button
            onClick={(e) => downloadFile(e, 0)}
            style={{
              backgroundColor: "#1d321acc",
            }}
            variant="contained"
          >
            말씀노트
          </Button>
          <Button
            style={{
              backgroundColor: "#1d321acc",
            }}
            onClick={(e) => downloadFile(e, 1)}
            variant="contained"
          >
            포스터 1
          </Button>
          <Button
            style={{
              backgroundColor: "#1d321acc",
            }}
            onClick={(e) => downloadFile(e, 2)}
            variant="contained"
          >
            포스터 2
          </Button>
          <Button
            style={{
              backgroundColor: "#1d321acc",
            }}
            onClick={(e) => downloadFile(e, 3)}
            variant="contained"
          >
            포스터 3
          </Button>
          <Button
            style={{
              backgroundColor: "#1d321acc",
            }}
            onClick={(e) => downloadFile(e, 4)}
            variant="contained"
          >
            포스터 4
          </Button>
        </Stack>
      </Stack>
    )
  }

  return (
    <Stack height="100%">
      {/* @ts-ignore */}
      <img ref={imgRef} src="./bg_info.jpeg" />
      <a href="https://www.instagram.com/suwonjeilch_youngpeople/">
        <img
          className={styles["img_button"]}
          style={{
            width: calc(150) + "px",
            top: calc(220) + "px",
            left: calc(200) + "px",
          }}
          src="./instagram.png"
        />
      </a>
      <a href="https://youtube.com/playlist?list=PLdxGTKLutWR4V-8fvAX47193ut-_AJOvo&feature=shared">
        <img
          className={styles["img_button"] + " " + styles["play_list"]}
          style={{
            width: calc(110) + "px",
            top: calc(361) + "px",
            left: calc(174) + "px",
          }}
          src="./play_list.png"
        />
      </a>
      <img
        className={styles["img_button"] + " " + styles["poster"]}
        onClick={onClickPoster}
        style={{
          width: calc(100) + "px",
          top: calc(285) + "px",
          left: calc(68) + "px",
        }}
        src="./poster.png"
      />
      <img
        onClick={forReady}
        className={styles["img_button"] + " " + styles["notice"]}
        style={{
          width: calc(100) + "px",
          top: calc(456) + "px",
          left: calc(56) + "px",
        }}
        src="./notice.png"
      />
      {showDownloadPopup && <DownloadPopup />}
    </Stack>
  )
}
