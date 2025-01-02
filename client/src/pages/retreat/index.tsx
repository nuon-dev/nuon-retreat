"use client"

import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import BotChat, { ChatButton } from "components/BotChat"
import MyChat from "components/MyChat"
import dayjs from "dayjs"
import useBotChatLogic, { EditContent } from "hooks/useBotChatLogic"
import InputText from "components/InputText"

export interface Chat extends ChatContent {
  time: string
}

export interface ChatContent {
  type: "bot" | "my"
  content: string
  buttons?: ChatButton[]
}

let ChatList: Chat[] = []
function index() {
  const [chatList, setChatList] = useState<Array<Chat>>([])
  const { editContent, editUserAge, editUserSex, editUserPhone } =
    useBotChatLogic({
      addChat,
    })

  function addChat(chatContent: ChatContent) {
    const chat = chatContent as Chat
    chat.time = dayjs().format("HH:mm")
    ChatList.push(chat)
    setChatList([...ChatList])
  }

  function submit(text: string) {
    addChat({ type: "my", content: text })
    switch (editContent) {
      case EditContent.name:
        editUserAge()
        break
      case EditContent.age:
        editUserSex()
        break
      case EditContent.sex:
        editUserPhone()
        break

      case EditContent.phone:
        break
      default:
        break
    }
  }

  return (
    <Stack
      pt="20px"
      pb="60px"
      style={{
        minHeight: "100vh",
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
      <InputText submit={submit} />
    </Stack>
  )
}

export default index
