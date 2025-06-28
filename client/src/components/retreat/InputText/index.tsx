import { Button, Stack } from "@mui/material"
import { useState, createRef } from "react"
import styles from "./index.module.css"
import { useAtomValue } from "jotai"
import { isEvenAtom } from "@/state/retreat"

interface IProps {
  submit: (text: string) => void
}

export default function InputText({ submit }: IProps) {
  const [text, setText] = useState("")
  const inputRef = createRef<HTMLInputElement>()
  const hiddenInputRef = createRef<HTMLInputElement>()
  const isEven = useAtomValue(isEvenAtom)

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
      bgcolor={isEven ? "#DA6C6C" : "rgb(145, 22, 27)"}
      direction="row"
      alignItems="center"
      zIndex="200"
    >
      <Stack flex={1} justifyContent="center" height="34px">
        <input
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
            color: "white",
            fontWeight: "200",
            borderRadius: "200px",
            backgroundColor: isEven ? "#AF3E3E" : "#71161a",
            fontFamily: "SCDream",
          }}
        >
          전송
        </Button>
      </Stack>
    </Stack>
  )
}
