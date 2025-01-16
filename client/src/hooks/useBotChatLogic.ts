import { ChatContent } from "pages/retreat"
import { useEffect, useState } from "react"
import useUserData, { UserInformationAtom } from "./useUserData"
import { useRecoilValue } from "recoil"
import useRetreatData, { RetreatAttendAtom } from "./useRetreatData"
import { HowToMove } from "@server/entity/types"

interface IPops {
  addChat: (chat: ChatContent) => void
}

export enum EditContent {
  none,
  name,
  yearOfBirth,
  gender,
  phone,
  darak,
  HowToGo,
  HowToBack,
  etc,
}
/*
1. 어떻게 들어올 것인가?
1.1 버스
1.2 자가용
1.3 카풀 필요
1.4 대중교통
1.2.1 자가용이면 카풀이 가능한가?
1.2.1.1 언제 탈 수 있는가?
1.2.1.2 몇명이 탈 수 있는가?
1.3.1 카풀이면 언제 탈 수 있는가?
1.3.2 카풀이면 어디서 탈 수 있는가?
1.4.1 대중교통이면 언제 도착 하는가?
2. 어떻게 나갈 것인가?
2.1 버스
2.2 자가용

*/

export default function useBotChatLogic({ addChat }: IPops) {
  const [editContent, setEditContent] = useState<EditContent>(EditContent.none)
  const {
    getUserDataFromToken,
    getUserDataFromKakaoLogin,
    editUserInformation,
    checkMissedUserInformation,
    saveUserInformation,
  } = useUserData()

  const { checkMissedRetreatAttendInformation, editRetreatAttendInformation } =
    useRetreatData()

  const userInformation = useRecoilValue(UserInformationAtom)
  const retreatAttend = useRecoilValue(RetreatAttendAtom)

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
    if (!userInformation) {
      return
    }
    setTimeout(checkMissedUserInformationAndEdit)
    if (editContent !== EditContent.none && !checkMissedUserInformation()) {
      addChat({
        type: "bot",
        content: `정보를 저장했어요!.`,
      })
      setEditContent(EditContent.none)
    }
  }, [userInformation, retreatAttend])

  function checkMissedUserInformationAndEdit() {
    const missedContent = checkMissedUserInformation()
    const missedRetreatAttendContent = checkMissedRetreatAttendInformation()
    const allIsOkay =
      missedContent === EditContent.none &&
      missedRetreatAttendContent === EditContent.none
    if (allIsOkay) {
      whatDoYouWantToDo()
      saveUserInformation()
      return false
    }
    switch (missedContent) {
      case EditContent.name:
        editUserName()
        return true
      case EditContent.yearOfBirth:
        editUserYearOfBirth()
        return true
      case EditContent.gender:
        editUserGender()
        return true
      case EditContent.phone:
        editUserPhone()
        return true
      case EditContent.darak:
        editDarak()
        return true
    }
    switch (missedRetreatAttendContent) {
      case EditContent.HowToGo:
        howToGo()
        return true
      case EditContent.HowToBack:
        howToBack()
        return true
    }

    addChat({
      type: "bot",
      content: `엇! 개발자의 실수가 있어요. 관리자에게 문의하세요!`,
    })
    return true
  }

  function howToGo() {
    addChat({
      type: "bot",
      content: `수련회장으로 어떻게 오실건가요?`,
      buttons: [
        {
          content: "버스",
          onClick: () => {
            addChat({
              type: "my",
              content: "버스",
            })
            editRetreatAttendInformation("HowToGo", HowToMove.together)
          },
        },
        {
          content: "자가용 (카풀 가능)",
          onClick: () => {
            addChat({
              type: "my",
              content: "자가용 (카풀 가능)",
            })
            editRetreatAttendInformation("HowToGo", HowToMove.driveCarAlone)
          },
        },
        {
          content: "자가용 (카풀 불가능)",
          onClick: () => {
            addChat({
              type: "my",
              content: "자가용 (카풀 불가능)",
            })
            editRetreatAttendInformation(
              "HowToGo",
              HowToMove.driveCarWithPerson
            )
          },
        },
        {
          content: "카풀 필요",
          onClick: () => {
            addChat({
              type: "my",
              content: "카풀 필요",
            })
            editRetreatAttendInformation("HowToGo", HowToMove.rideCar)
          },
        },
        {
          content: "대중교통",
          onClick: () => {
            addChat({
              type: "my",
              content: "대중교통",
            })
            editRetreatAttendInformation("HowToGo", HowToMove.goAlone)
          },
        },
      ],
    })
  }

  function whenToGo() {
    addChat({
      type: "bot",
      content: `언제 출발하실건가요?`,
      buttons: [],
    })
  }

  function howToBack() {
    addChat({
      type: "bot",
      content: `수련회장에서 어떻게 교회로 돌아가실건가요?`,
      buttons: [
        {
          content: "버스",
          onClick: () => {
            addChat({
              type: "my",
              content: "버스",
            })
            editRetreatAttendInformation("HowToBack", HowToMove.together)
          },
        },
        {
          content: "자가용",
          onClick: () => {
            addChat({
              type: "my",
              content: "자가용",
            })
            editRetreatAttendInformation("HowToBack", HowToMove.driveCarAlone)
          },
        },
      ],
    })
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

  async function checkUserData() {
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
      순장님은 ${userData.community?.name}님이에요.
      연락은 ${userData.phone}로 드릴게요.`,
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
        {
          content: "순장님",
          onClick: () => {
            addChat({
              type: "my",
              content: "순장님",
            })
            editDarak()
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

  async function editDarak() {
    addChat({
      type: "bot",
      content: "순장님은 누구인가요? 성까지 입력해주세요!",
    })
    setEditContent(EditContent.darak)
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
            checkUserData()
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
            checkUserData()
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
