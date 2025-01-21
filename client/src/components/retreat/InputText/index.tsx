import { Button, Stack } from "@mui/material"
import { useState, createRef, useEffect } from "react"
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

  useEffect(() => {
    console.log("global.visualViewport", global.visualViewport)
    if (global.visualViewport) {
      global.visualViewport.addEventListener("resize", () => {
        scrollTo(0, 0)
      })
    }
  })

  return (
    <Stack
      position="fixed"
      bottom="0px"
      width="100%"
      height="50px"
      bgcolor="white"
      direction="row"
      p="16px"
      alignItems="center"
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
          onChange={(e) => setText(e.target.value)}
          onSubmit={onClickSend}
        />
      </Stack>
      <Stack width="50px">
        <Button onClick={onClickSend} variant="contained">
          전송
        </Button>
      </Stack>
    </Stack>
  )
}
