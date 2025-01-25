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
      p="12px"
      bottom="0"
      width="100%"
      bgcolor="white"
      direction="row"
      alignItems="center"
      zIndex="200"
    >
      <Stack width="calc(100% - 50px)" justifyContent="center">
        <input
          color="#5D4431"
          ref={inputRef}
          type="text"
          value={text}
          onSubmit={onClickSend}
          className={styles["input"]}
          placeholder="메시지 입력"
          onChange={(e) => setText(e.target.value)}
          style={{
            height: "34px",
            padding: "12px",
            borderRadius: "24px",
            backgroundColor: "#eee",
          }}
        />
        <input
          type="text"
          style={{
            position: "fixed",
            opacity: 1,
            zIndex: 1,
          }}
          ref={hiddenInputRef}
        />
      </Stack>
      <Stack width="50px">
        <Button
          onClick={onClickSend}
          variant="contained"
          style={{
            backgroundColor: "#FAE54D",
            color: "black",
            borderRadius: "200px",
          }}
        >
          전송
        </Button>
      </Stack>
    </Stack>
  )
}
