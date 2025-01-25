"use client"

import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import BotChat from "components/retreat/BotChat"
import MyChat from "components/retreat/MyChat"
import dayjs from "dayjs"
import useBotChatLogic, { EditContent } from "hooks/useBotChatLogic"
import InputText from "components/retreat/InputText"
import useUserData from "hooks/useUserData"
import { get, post } from "pages/api"
import { Community } from "@server/entity/community"
import InOutInfoForm from "components/retreat/InOutInfoForm"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { StopRetreatBodyScrollAtom } from "state/retreat"
import { Chat, ChatContent } from "types/retreat"
import Image from "next/image"
import { NotificationMessage } from "state/notification"

let ChatList: Chat[] = []
export default function Index() {
  const [chatList, setChatList] = useState<Array<Chat>>([])
  const { editUserInformation } = useUserData()
  const { editContent } = useBotChatLogic({
    addChat,
  })
  const stopScroll = useRecoilValue(StopRetreatBodyScrollAtom)

  function addChat(chatContent: ChatContent) {
    const chat = chatContent as Chat
    chat.time = dayjs().format("HH:mm")
    if (chat.type === "my") {
      post("/retreat/chat", { chat: chat.content, type: editContent })
    }
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
        if (yearOfBirth === 1997) {
          addChat({
            type: "bot",
            content: "너 제육제육 멤버였구나? 반가워~!!!",
          })
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
        color: "#5D4431",
      }}
      minHeight="100vh"
    >
      <Stack
        top="0"
        width="100%"
        zIndex="100"
        position="fixed"
        bgcolor="#F2E8DE"
      >
        <Stack
          top="24px"
          position="fixed"
          fontSize="18px"
          width="100vw"
          textAlign="center"
        >
          2025 겨울 수련회
        </Stack>
        <Stack
          px="12px"
          pt="18px"
          fontSize="20px"
          direction="row"
          fontWeight="400"
          textAlign="center"
          alignItems="center"
          justifyContent="space-between"
        >
          <Image
            src="/icon/free-icon-arrow-down.png"
            width="30"
            height="30"
            alt=""
            style={{
              transform: "rotate(90deg)",
            }}
          />
          <Stack direction="row" gap="12px">
            <Image
              src="/icon/free-icon-magnifier.png"
              width="30"
              height="30"
              alt=""
            />
            <Image
              src="/icon/free-icon-hamburger.png"
              width="30"
              height="30"
              alt=""
            />
          </Stack>
        </Stack>
        <TopNotification />
      </Stack>
      <Stack height="90px" />
      <Stack
        gap="8px"
        zIndex="10"
        position="static"
        style={{
          overflowY: stopScroll ? "hidden" : "visible",
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
            return (
              <MyChat key={index} content={chat.content} time={chat.time} />
            )
          }
        })}
        <InputText submit={submit} />
      </Stack>
      <Stack
        style={{
          top: 0,
          zIndex: 0,
          width: "100vw",
          height: "100vh",
          position: "fixed",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundImage: "url('/retreat_bg.jpg')",
          backgroundColor: "#F2E8DE",
        }}
      />
      <InOutInfoForm />
    </Stack>
  )
}

function TopNotification() {
  const [showDetail, setShowDetail] = useState(false)
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    if (showDetail) {
      setNotificationMessage("계좌번호가 복사 되었습니다.")
      navigator.clipboard.writeText("3333328233700")
    }
  }, [showDetail])

  return (
    <Stack
      p="8px"
      mt="12px"
      mx="8px"
      mb="0"
      gap="8px"
      bgcolor="white"
      direction="row"
      borderRadius="16px"
      boxShadow="0px 0px 10px 0px #AAA"
      justifyContent="space-between"
      onClick={() => setShowDetail(!showDetail)}
    >
      <Image
        src="/icon/free-icon-megaphone.png"
        width="20"
        height="20"
        alt=""
      />
      <Stack fontSize="15px" flex={1}>
        안녕하세요. 2025 겨울 수련회 신청 폼 입니다.
        {showDetail && (
          <Stack>수련회비 계좌 - 3333328233700 카카오뱅크 성은비</Stack>
        )}
      </Stack>
      <Image
        src="/icon/free-icon-arrow-down.png"
        width="20"
        height="20"
        style={{
          animation: "0.5s",
          rotate: showDetail ? "180deg" : "0deg",
        }}
        alt=""
      />
    </Stack>
  )
}
