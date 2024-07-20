import { Stack } from "@mui/material"
import styles from "./index.module.css"
import { useEffect, useRef, useState } from "react"
import { useSetRecoilState } from "recoil"
import { NotificationMessage } from "state/notification"

export default function Info() {
  const imgRef = useRef<HTMLImageElement>()
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

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
    const files = [
      "말씀노트.pdf",
      "P20240716_223129000_E07A8DD3-CBF4-4105-A326-19A7C724BA12.JPG",
      "P20240716_223129000_F20057DC-3386-4C7E-911D-09EB4BAC36D7.JPG",
      "P20240717_200239000_44C46409-6D63-4200-B115-4F6655841989.JPG",
      "P20240717_200239000_EFFFC8E1-1776-4B74-AAA5-E46ED8ECC678.JPG",
    ]

    files.forEach((fileName) => {
      var pom = document.createElement("a")
      // file 폴더의 파일을 다운로드
      var filePath = "/" + encodeURIComponent(fileName)
      pom.setAttribute("type", "application/octet-stream;charset=utf-8")
      pom.setAttribute("href", filePath)
      pom.setAttribute("download", fileName)
      pom.click()
      pom.remove()
    })
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
      <a href="https://youtu.be/IOfautRI2aA">
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
    </Stack>
  )
}
