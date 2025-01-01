"use client"

import { post } from "../api"
import useKakaoHook from "kakao"
import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import BotChat, { ChatButton } from "components/BotChat"
import MyChat from "components/MyChat"
import dayjs from "dayjs"

interface Chat {
  type: "bot" | "my"
  content: string
  time: string
  buttons?: ChatButton[]
}

let ChatList: Chat[] = []
function index() {
  const [chatList, setChatList] = useState<Array<Chat>>([])

  const { getKakaoToken } = useKakaoHook()

  async function login() {
    let kakaoToken
    try {
      kakaoToken = await getKakaoToken()
    } catch {
      addChat({
        content:
          "카카오 로그인 모듈 로딩에 실패했어요. (ㅠ.ㅠ) 관리자에게 문의 하세요!",
        type: "bot",
      })
      return
    }
    try {
      const { token } = await post("/auth/receipt-record", {
        kakaoId: kakaoToken,
      })
      localStorage.setItem("token", token)
      const { result, userData } = await post("/auth/check-token", {
        token,
      })
      if (result === "true") {
        addChat({
          type: "bot",
          content: `어! 저는 당신을 알아요! ${userData.name}님이시죠? 환영합니다!`,
        })
      } else {
        addChat({
          content:
            "카카오 로그인을 실패했어요. (ㅠ.ㅠ) 관리자에게 문의 하세요! (code: 02)",
          type: "bot",
        })
      }
    } catch {
      addChat({
        content:
          "서버가 응답하지 않네요. (ㅠ.ㅠ) 관리자에게 문의 하세요! (code: 03)",
        type: "bot",
      })
    }
  }

  useEffect(() => {
    addChat({
      type: "bot",
      content:
        "안녕하세요! 새벽이입니다.\n수련회에 관련하여 당신을 도와줄거에요!",
    })
    checkToken()
  }, [])

  async function checkToken() {
    const token = localStorage.getItem("token")
    if (!token) {
      addChat({
        type: "bot",
        content: "제가 당신을 기억할 수 있도록 카카오 로그인을 해주세요!",
        buttons: [
          {
            content: "카카오톡 로그인",
            onClick: login,
          },
        ],
      })
      return
    }
    const { result, userData } = await post("/auth/check-token", {
      token,
    })
    if (result === "true") {
      addChat({
        type: "bot",
        content: `${userData.name}님 또 오셨네요? 환영합니다! 무엇을 도와드릴까요?`,
      })
    }
  }

  function addChat(chat: any) {
    chat.time = dayjs().format("HH:mm")
    ChatList.push(chat)
    setChatList([...ChatList])
  }

  return (
    <Stack
      pt="20px"
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgb(190, 205, 222)",
      }}
    >
      {chatList.map((chat, index) => {
        if (chat.type === "bot") {
          return (
            <BotChat
              key={index}
              content={chat.content}
              time={chat.time}
              buttons={chat.buttons}
            />
          )
        } else {
          return <MyChat key={index} content={chat.content} time={chat.time} />
        }
      })}
    </Stack>
  )
}

export default index
