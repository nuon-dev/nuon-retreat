"use client"

import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import BotChat, { ChatButton } from "components/BotChat"
import MyChat from "components/MyChat"
import dayjs from "dayjs"
import useBotChatLogic, { EditContent } from "hooks/useBotChatLogic"
import InputText from "components/InputText"
import useUserData from "hooks/useUserData"

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
  const { editUserInformation, saveUserInformation } = useUserData()
  const { editContent, editUserAge, editUserSex, savedUserInformation } =
    useBotChatLogic({
      addChat,
    })

  function addChat(chatContent: ChatContent) {
    const chat = chatContent as Chat
    chat.time = dayjs().format("HH:mm")
    ChatList.push(chat)
    setChatList([...ChatList])
    setTimeout(() => {
      global.scrollBy(0, 1000)
    }, 0)
  }

  async function submit(text: string) {
    addChat({ type: "my", content: text })
    switch (editContent) {
      case EditContent.name:
        editUserInformation("name", text)
        editUserAge()
        break
      case EditContent.age:
        let age = parseInt(text)
        if (age < 50) {
          age += 2000
        } else if (age < 100 && age > 50) {
          age += 1900
        }
        editUserInformation("age", age)
        editUserSex()
        break
        break
      case EditContent.phone:
        editUserInformation("phone", text)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await saveUserInformation()
        savedUserInformation()
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
        flex: "1",
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
