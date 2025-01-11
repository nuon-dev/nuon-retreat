import { ChatContent } from "pages/retreat"
import { useEffect, useState } from "react"
import useUserData, { UserInformationAtom } from "./useUserData"
import { useRecoilValue } from "recoil"

interface IPops {
  addChat: (chat: ChatContent) => void
}

export enum EditContent {
  none,
  name,
  yearOfBirth,
  gender,
  phone,
  etc,
  village,
  darak,
}
export default function useBotChatLogic({ addChat }: IPops) {
  const [editContent, setEditContent] = useState<EditContent>(EditContent.none)
  const {
    getUserDataFromToken,
    getUserDataFromKakaoLogin,
    editUserInformation,
    checkMissedUserInformation,
    saveUserInformation,
  } = useUserData()

  const userInformation = useRecoilValue(UserInformationAtom)

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
      firstTime()
    } else {
      addChat({
        type: "bot",
        content: `또 오셨군요!. ${userData.name}님이 환영합니다!`,
      })
    }
  }

  async function firstTime() {
    addChat({
      type: "bot",
      content: "처음 오셨군요! 당신에 대해 더 알아보고 싶어요.",
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
      return
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

  useEffect(() => {
    if (userInformation) {
      setTimeout(checkMissedUserInformationAndEdit)
    }
  }, [userInformation])

  function checkMissedUserInformationAndEdit() {
    const missedContent = checkMissedUserInformation()
    if (missedContent === EditContent.none) {
      whatDoYouWantToDo()
      return false
    }
    switch (missedContent) {
      case EditContent.name:
        editUserName()
        break
      case EditContent.yearOfBirth:
        editUserYearOfBirth()
        break
      case EditContent.gender:
        editUserGender()
        break
      case EditContent.phone:
        editUserPhone()
        break
      default:
        addChat({
          type: "bot",
          content: `엇! 개발자의 실수가 있어요. 관리자에게 문의하세요!`,
        })
        break
    }
    return true
  }

  function editUserName() {
    addChat({
      type: "bot",
      content: `이름을 알려주세요.`,
    })
    setEditContent(EditContent.name)
  }

  function editUserYearOfBirth() {
    addChat({
      type: "bot",
      content: `몇년생이신가요?. 빠른은 동기기준입니다.`,
    })
    setEditContent(EditContent.yearOfBirth)
  }

  async function checkUserData(phone: string) {
    const userData = userInformation
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
    addChat({
      type: "bot",
      content: `${userData.name}님이 입력하신 정보를 정리해볼게요. 
      ${userData.yearOfBirth}년생이고 ${
        userData.gender === "man" ? "남성" : "여성"
      }이시네요. 
      연락은 ${phone}로 드릴게요.`,
      buttons: [
        {
          content: "엇.. 틀린게 있어요.",
          onClick: () => {
            selectEditContent()
          },
        },
        {
          content: "네! 좋아요.",
          onClick: async () => {
            await saveUserInformation()
            savedUserInformation()
          },
        },
      ],
    })
  }

  function selectEditContent() {
    addChat({
      type: "bot",
      content: `무엇을 바꾸고 싶으신가요?`,
      buttons: [
        {
          content: "이름",
          onClick: () => {
            addChat({
              type: "my",
              content: "이름",
            })
            editUserName()
          },
        },
        {
          content: "생년",
          onClick: () => {
            addChat({
              type: "my",
              content: "생년",
            })
            editUserYearOfBirth()
          },
        },
        {
          content: "성별",
          onClick: () => {
            addChat({
              type: "my",
              content: "성별",
            })
            editUserGender()
          },
        },
        {
          content: "연락처",
          onClick: () => {
            addChat({
              type: "my",
              content: "연락처",
            })
            editUserPhone()
          },
        },
      ],
    })
  }

  function editUserGender() {
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
            editUserInformation("gender", "man")

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
            editUserInformation("gender", "woman")
            editUserPhone()
          },
        },
      ],
    })
    setEditContent(EditContent.gender)
  }

  function editUserPhone() {
    addChat({
      type: "bot",
      content: `무슨 일이 있으면 연락드릴게요! 연락처를 알려주세요.`,
    })
    setEditContent(EditContent.phone)
  }

  function savedUserInformation() {
    addChat({
      type: "bot",
      content: `모든 정보를 저장했어요!`,
    })
    setEditContent(EditContent.none)
  }

  function whatDoYouWantToDo() {
    addChat({
      type: "bot",
      content: `무엇을 도와드릴까요?`,
      buttons: [
        {
          content: "나의 정보 확인",
          onClick: () => {
            addChat({
              type: "my",
              content: "나의 정보  확인",
            })
            checkUserData("")
          },
        },
        {
          content: "나의 정보 수정",
          onClick: () => {
            addChat({
              type: "my",
              content: "나의 정보 수정",
            })
            selectEditContent()
          },
        },
        {
          content: "수련회 접수 내용 확인",
          onClick: () => {
            addChat({
              type: "my",
              content: " 수련회 접수 내용 확인",
            })
            checkUserData("")
          },
        },
        {
          content: "수련회 접수 내용 수정",
          onClick: () => {
            addChat({
              type: "my",
              content: " 수련회 접수 내용 수정",
            })
            selectEditContent()
          },
        },
      ],
    })
  }
  return {
    editContent,
  }
}
