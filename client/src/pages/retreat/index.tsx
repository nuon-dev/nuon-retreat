"use client"

import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import BotChat, { ChatButton } from "components/retreat/BotChat"
import MyChat from "components/retreat/MyChat"
import dayjs from "dayjs"
import useBotChatLogic, { EditContent } from "hooks/useBotChatLogic"
import InputText from "components/retreat/InputText"
import useUserData from "hooks/useUserData"
import { get } from "pages/api"
import { Community } from "@server/entity/community"

export interface Chat extends ChatContent {
  time: string
}

export interface ChatContent {
  type: "bot" | "my"
  content: string
  buttons?: ChatButton[]
}

let ChatList: Chat[] = []
export default function Index() {
  const [chatList, setChatList] = useState<Array<Chat>>([])
  const { editUserInformation } = useUserData()
  const { editContent } = useBotChatLogic({
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
        break
      case EditContent.yearOfBirth:
        let yearOfBirth = parseInt(text)
        if (yearOfBirth < 50) {
          yearOfBirth += 2000
        } else if (yearOfBirth < 100 && yearOfBirth > 50) {
          yearOfBirth += 1900
        }
        editUserInformation("yearOfBirth", yearOfBirth)
        break
      case EditContent.phone:
        editUserInformation("phone", text)
        break
      case EditContent.darak:
        const communityList: Community[] = await get("/auth/community")
        const foundCommunity = communityList.find((c) => c.name === text)
        if (foundCommunity) {
          editUserInformation("community", foundCommunity)
        } else {
          addChat({
            type: "bot",
            content: "순장님을 찾지 못했어요 ㅠㅠ 다시 입력해주세요.",
          })
        }
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
