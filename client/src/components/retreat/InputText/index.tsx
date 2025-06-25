import { Button, Stack } from "@mui/material"
import { useState, createRef } from "react"
import styles from "./index.module.css"

interface IProps {
  submit: (text: string) => void
}

export default function InputText({ submit }: IProps) {
  const [text, setText] = useState("")
  const inputRef = createRef<HTMLInputElement>()
  const hiddenInputRef = createRef<HTMLInputElement>()

  async function onClickSend() {
    if (inputRef.current && hiddenInputRef.current) {
      //버퍼 지우기 용
      hiddenInputRef.current.focus()
      inputRef.current.focus()
    }
    if (text.length === 0) {
      return
    }
    submit(text)
    setText("")
  }

  return (
    <Stack
      p="8px"
      px="6px"
      bottom="0"
      width="100%"
      bgcolor="#d52c1f"
      direction="row"
      alignItems="center"
      zIndex="200"
    >
      <Stack flex={1} justifyContent="center" height="34px">
        <input
          color="#d52c1f"
          ref={inputRef}
          type="text"
          value={text}
          onSubmit={onClickSend}
          className={styles["input"]}
          placeholder="메시지 입력"
          onChange={(e) => setText(e.target.value)}
          style={{
            borderRadius: "24px",
            backgroundColor: "white",
          }}
        />
        <input
          type="text"
          style={{
            position: "fixed",
            opacity: 1,
            display: "none",
            zIndex: 1,
          }}
          ref={hiddenInputRef}
        />
      </Stack>
      <Stack width="64px" mr="8px">
        <Button
          onClick={onClickSend}
          variant="contained"
          style={{
            width: "50px",
            color: "#fffbc8",
            fontWeight: "200",
            borderRadius: "200px",
            backgroundColor: "#91161b",
            fontFamily: "Cafe24Ohsquare",
          }}
        >
          전송
        </Button>
      </Stack>
    </Stack>
  )
}
