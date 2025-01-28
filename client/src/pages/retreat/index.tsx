"use client"

import { Stack } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import BotChat from "components/retreat/BotChat"
import MyChat from "components/retreat/MyChat"
import dayjs from "dayjs"
import useBotChatLogic, { EditContent } from "hooks/useBotChatLogic"
import InputText from "components/retreat/InputText"
import useUserData from "hooks/useUserData"
import { get, post } from "pages/api"
import { Community } from "@server/entity/community"
import InOutInfoForm from "components/retreat/InOutInfoForm"
import { useSetRecoilState } from "recoil"
import { Chat, ChatContent } from "types/retreat"
import Image from "next/image"
import { NotificationMessage } from "state/notification"
import useRetreatData from "hooks/useRetreatData"

let ChatList: Chat[] = []
export default function Index() {
  const [chatList, setChatList] = useState<Array<Chat>>([])
  const { editUserInformation } = useUserData()
  const { editContent, setEditContent } = useBotChatLogic({
    addChat,
  })
  const { editRetreatAttendInformation } = useRetreatData()
  const textAreaRef = useRef<HTMLDivElement>(null)

  function addChat(chatContent: ChatContent) {
    if (ChatList.length > 0) {
      const lastChat = ChatList[ChatList.length - 1]
      if (lastChat.type === "bot" && lastChat.content === chatContent.content) {
        return
      }
      if (
        lastChat.type === "my" &&
        lastChat.content === "카풀 입력창 열기" &&
        chatContent.type === "bot" &&
        chatContent.content === "카풀 정보 등록이 필요해요!"
      ) {
        return
      }
    }
    const chat = chatContent as Chat
    chat.time = dayjs().format("HH:mm")
    if (chat.type === "my") {
      post("/retreat/chat", { chat: chat.content, type: editContent })
    }
    ChatList.push(chat)
    setChatList([...ChatList])
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.scrollTo(
          textAreaRef.current.scrollHeight,
          textAreaRef.current.scrollHeight
        )
      }
    }, 100)
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
            content: "너 최강 제육제육 멤버였구나? 반가워~!!!",
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
      case EditContent.etc:
        editRetreatAttendInformation("etc", text)
        break
      default:
        break
    }
  }

  return (
    <Stack position="fixed" width="100vw" color="#5D4431" height="100svh">
      <Stack top="0" width="100%" zIndex="100" bgcolor="#F2E8DE">
        <Stack
          top="24px"
          width="100vw"
          fontSize="18px"
          position="fixed"
          fontWeight="500"
          textAlign="center"
          fontFamily="Cafe24Ohsquare"
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
      <Stack
        pt="20px"
        pb="4px"
        gap="8px"
        zIndex="10"
        ref={textAreaRef}
        overflow="auto"
        height="calc(100svh - 148px)"
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
      </Stack>
      <InputText submit={submit} />
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
      <InOutInfoForm addChat={addChat} setEditContent={setEditContent} />
    </Stack>
  )
}

function TopNotification() {
  const [showDetailArea, setShowDetailArea] = useState(false)
  const [showDetailText, setShowDetailText] = useState(false)
  const [showDetailTextOpacity, setShowDetailTextOpacity] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const setNotificationMessage = useSetRecoilState(NotificationMessage)

  useEffect(() => {
    if (showDetail) {
      setNotificationMessage("계좌번호가 복사 되었습니다.")
      navigator.clipboard.writeText("3333328233700")
    }

    if (showDetail) {
      setShowDetailText(true)
      setTimeout(() => {
        setShowDetailArea(true)
        setShowDetailTextOpacity(true)
      }, 250)
    } else {
      setShowDetailTextOpacity(false)
      setTimeout(() => {
        setShowDetailArea(false)
        setTimeout(() => {
          setShowDetailText(false)
        }, 250)
      }, 250)
    }
  }, [showDetail])

  return (
    <Stack
      p="8px"
      mt="12px"
      mx="8px"
      mb="0"
      gap="6px"
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
      <Stack
        flex="1"
        style={{
          transition: "max-height 0.3s",
        }}
        fontSize="15px"
        fontWeight="500"
        fontFamily="Cafe24OhsquareAir"
        maxHeight={showDetailArea ? "100px" : "20px"}
      >
        2025 겨울 수련회 신청 폼 입니다.
        {showDetailText ? (
          <Stack
            style={{
              transition: "opacity 0.3s",
              opacity: showDetailTextOpacity ? 1 : 0,
            }}
          >
            회비 계좌는 3333328233700 카카오뱅크 성은비 입니다.
          </Stack>
        ) : (
          "회비 계좌는 ...."
        )}
      </Stack>
      <Image
        src="/icon/free-icon-arrow-down.png"
        width="20"
        height="20"
        style={{
          transition: "rotate 0.3s",
          rotate: showDetail ? "180deg" : "0deg",
        }}
        alt=""
      />
    </Stack>
  )
}
