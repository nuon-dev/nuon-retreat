import { ChatContent } from "pages/retreat"
import { useEffect, useState } from "react"
import useUserData from "./useUserData"

interface IPops {
  addChat: (chat: ChatContent) => void
}

export enum EditContent {
  none,
  name,
  age,
  sex,
  phone,
  etc,
  village,
  darak,
}
export default function useBotChatLogic({ addChat }: IPops) {
  const [editContent, setEditContent] = useState<EditContent>(EditContent.none)
  const { getUserDataFromToken, getUserDataFromKakaoLogin } = useUserData()

  useEffect(() => {
    init()
  }, [])

  async function init() {
    addChat({
      type: "bot",
      content:
        "안녕하세요! 새벽이입니다. 수련회에 관련하여 당신을 도와줄거에요!",
    })
    let userData = await getUserDataFromToken()
    if (!userData) {
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
    if (!userData.name) {
      editUserName()
      return
    }
    addChat({
      type: "bot",
      content: `또 오셨군요!. ${userData.name}님이 환영합니다!`,
    })
  }

  async function login() {
    addChat({
      type: "my",
      content: "카카오톡 로그인",
    })

    const userData = await getUserDataFromKakaoLogin()
    if (!userData) {
      addChat({
        content: "카카오 로그인을 실패했어요. (ㅠ.ㅠ) 관리자에게 문의 하세요!",
        type: "bot",
      })
    }
    if (!userData.name) {
      editUserName()
      return
    }
    addChat({
      type: "bot",
      content: `어! 저는 당신을 알아요! ${userData.name}님이시죠? 환영합니다!`,
    })
  }

  function editUserName() {
    addChat({
      type: "bot",
      content: `우리 처음 보는거 같은데요! 당신에 대해 알고 싶어요. 이름을 알려주세요.`,
    })
    setEditContent(EditContent.name)
  }

  function editUserAge() {
    addChat({
      type: "bot",
      content: `그럼 몇년생이신가요?. 빠른은 동기기준입니다.`,
    })
    setEditContent(EditContent.age)
  }

  function editUserSex() {
    addChat({
      type: "bot",
      content: `성별은 어떻게 되시나요?`,
      buttons: [
        {
          content: "남자",
          onClick: () => {
            addChat({
              type: "my",
              content: "남자",
            })
            editUserPhone()
          },
        },
        {
          content: "여자",
          onClick: () => {
            addChat({
              type: "my",
              content: "여자",
            })
            editUserPhone()
          },
        },
      ],
    })
    setEditContent(EditContent.sex)
  }

  function editUserPhone() {
    addChat({
      type: "bot",
      content: `무슨 일이 있으면 연락드릴게요! 연락처를 알려주세요.`,
    })
    setEditContent(EditContent.phone)
  }

  return { editContent, editUserPhone, editUserSex, editUserAge }
}
