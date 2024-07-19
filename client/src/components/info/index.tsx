import { Stack } from "@mui/material"
import styles from "./index.module.css"

export default function Info() {
  return (
    <Stack>
      <img src="./bg_info.jpeg" />
      <a href="https://www.instagram.com/suwonjeilch_youngpeople/">
        <img
          className={styles["img_button"] + " " + styles["instagram"]}
          src="./instagram.png"
        />
      </a>
      <img
        className={styles["img_button"] + " " + styles["play_list"]}
        src="./play_list.png"
      />
      <img
        className={styles["img_button"] + " " + styles["poster"]}
        src="./poster.png"
      />
      <img
        className={styles["img_button"] + " " + styles["notice"]}
        src="./notice.png"
      />
    </Stack>
  )
}
