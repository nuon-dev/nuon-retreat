import { Button, Stack } from "@mui/material"
import { useState, createRef } from "react"
import styles from "./index.module.css"

interface IProps {
  submit: (text: string) => void
}

export default function InputText({ submit }: IProps) {
  const [text, setText] = useState("")
  const inputRef = createRef<HTMLInputElement>()

  function textEditor() {
    if (text.length === 0) {
      return <Stack color="#888">Enter a message</Stack>
    }
    return <Stack />
  }

  function onClickSend() {
    if (inputRef.current) {
      inputRef.current.focus()
    }
    if (text.length === 0) {
      return
    }
    submit(text)
    setText("")
  }

  function onFocus() {
    setTimeout(() => {
      global.scrollBy(0, global.innerHeight)
    }, 100)
  }

  return (
    <Stack
      p="16px"
      bottom="0"
      width="100%"
      height="50px"
      bgcolor="white"
      direction="row"
      position="fixed"
      alignItems="center"
      zIndex="200"
    >
      <Stack
        width="calc(100% - 50px)"
        maxWidth="calc(100% - 50px)"
        justifyContent="center"
      >
        {textEditor()}
        <input
          ref={inputRef}
          className={styles["input"]}
          type="text"
          value={text}
          onFocus={onFocus}
          onChange={(e) => setText(e.target.value)}
          onSubmit={onClickSend}
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
