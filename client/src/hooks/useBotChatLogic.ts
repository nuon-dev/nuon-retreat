import { useEffect, useState } from "react"
import useUserData, { UserInformationAtom } from "./useUserData"
import { useRecoilValue, useSetRecoilState } from "recoil"
import useRetreatData from "./useRetreatData"
import { Days, HowToMove, InOutType } from "@server/entity/types"
import { ChatContent } from "types/retreat"
import {
  InOutInformationAtom,
  RetreatAttendAtom,
  ShowInOutInfoComponentAtom,
} from "state/retreat"

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
  howToGo,
  howToBack,
  etc,
  inOutInfo,
}

let sayBotNow = false

export default function useBotChatLogic({ addChat }: IPops) {
  const [editContent, setEditContent] = useState<EditContent>(EditContent.none)
  const {
    getUserDataFromToken,
    getUserDataFromKakaoLogin,
    editUserInformation,
    checkMissedUserInformation,
    saveUserInformation,
  } = useUserData()

  const {
    checkMissedRetreatAttendInformation,
    editRetreatAttendInformation,
    saveRetreatAttendInformation,
    fetchInOutInfo,
    fetchRetreatAttendInformation,
  } = useRetreatData()

  const userInformation = useRecoilValue(UserInformationAtom)
  const retreatAttend = useRecoilValue(RetreatAttendAtom)
  const inOutInfos = useRecoilValue(InOutInformationAtom)
  const setShowInOutInfoForm = useSetRecoilState(ShowInOutInfoComponentAtom)

  useEffect(() => {
    init()
  }, [])

  async function init() {
    let userData = await getUserDataFromToken()
    if (!userData) {
      addChat({
        type: "bot",
        content:
          "안녕하세요! 새벽이입니다. 수련회에 관련하여 당신을 도와줄거에요!",
      })
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
      addChat({
        type: "bot",
        content:
          "안녕하세요! 새벽이입니다. 수련회에 관련하여 당신을 도와줄거에요!",
      })
      firstTime()
    } else if (userData.id.toString() === "2") {
      //개발자의 이스터에그, 해당 코드를 본다면 웃어 넘겨주세요..ㅎ
      addChat({
        type: "bot",
        content: `세상에서 제일 이쁜 채여니구나!! 반가워!!~~`,
      })
    } else if (userData.yearOfBirth === 1997) {
      addChat({
        type: "bot",
        content: `최강 제육제육 멤버 ${userData.name}! 반가워~`,
      })
    } else {
      addChat({
        type: "bot",
        content: `${userData.name}님 다시 만나서 반가워요!`,
      })
    }
  }

  async function saveAllInformation() {
    await saveUserInformation()
    await saveRetreatAttendInformation()
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
    if (userData.name) {
      addChat({
        type: "bot",
        content: `${userData.name}님 환영합니다!`,
      })
    }
  }

  useEffect(() => {
    if (!userInformation || !retreatAttend || !inOutInfos) {
      return
    }
    if (sayBotNow) {
      return
    }
    sayBotNow = true
    setTimeout(checkMissedUserInformationAndEdit)
    if (editContent !== EditContent.none) {
      setEditContent(EditContent.none)
      saveAllInformation()
    }
    if (
      editContent !== EditContent.none &&
      !checkMissedUserInformation() &&
      !checkMissedRetreatAttendInformation()
    ) {
      addChat({
        type: "bot",
        content: `접수가 완료 되었어요!`,
      })
    }
  }, [userInformation, retreatAttend, inOutInfos])

  function checkMissedUserInformationAndEdit() {
    setTimeout(() => {
      sayBotNow = false
    }, 500)
    const missedContent = checkMissedUserInformation()
    const missedRetreatAttendContent = checkMissedRetreatAttendInformation()
    const allIsOkay =
      missedContent === EditContent.none &&
      missedRetreatAttendContent === EditContent.none
    if (allIsOkay) {
      whatDoYouWantToDo()
      saveAllInformation()
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
      case EditContent.howToGo:
        howToGo()
        return true
      case EditContent.howToBack:
        howToBack()
        return true
      case EditContent.inOutInfo:
        addChat({
          type: "bot",
          content: `출입 정보 등록이 필요해요!`,
          buttons: [
            {
              content: "입력창 열기",
              onClick: () => {
                addChat({
                  type: "my",
                  content: "입력창 열기",
                })
                setShowInOutInfoForm(true)
              },
            },
          ],
        })
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
            editRetreatAttendInformation("howToGo", HowToMove.together)
          },
        },
        {
          content: "자가용 (카풀 가능)",
          onClick: () => {
            addChat({
              type: "my",
              content: "자가용 (카풀 가능)",
            })
            editRetreatAttendInformation(
              "howToGo",
              HowToMove.driveCarWithPerson
            )
          },
        },
        {
          content: "자가용 (카풀 불가능)",
          onClick: () => {
            addChat({
              type: "my",
              content: "자가용 (카풀 불가능)",
            })
            editRetreatAttendInformation("howToGo", HowToMove.driveCarAlone)
          },
        },
        {
          content: "카풀 필요",
          onClick: () => {
            addChat({
              type: "my",
              content: "카풀 필요",
            })
            editRetreatAttendInformation("howToGo", HowToMove.rideCar)
          },
        },
        {
          content: "대중교통",
          onClick: () => {
            addChat({
              type: "my",
              content: "대중교통",
            })
            editRetreatAttendInformation("howToGo", HowToMove.goAlone)
          },
        },
      ],
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
            editRetreatAttendInformation("howToBack", HowToMove.together)
          },
        },
        {
          content: "자가용 (카풀 가능)",
          onClick: () => {
            addChat({
              type: "my",
              content: "자가용 (카풀 가능)",
            })
            editRetreatAttendInformation(
              "howToBack",
              HowToMove.driveCarWithPerson
            )
          },
        },
        {
          content: "자가용 (카풀 불가능)",
          onClick: () => {
            addChat({
              type: "my",
              content: "자가용 (카풀 불가능)",
            })
            editRetreatAttendInformation("howToBack", HowToMove.driveCarAlone)
          },
        },
        {
          content: "카풀 필요",
          onClick: () => {
            addChat({
              type: "my",
              content: "카풀 필요",
            })
            editRetreatAttendInformation("howToBack", HowToMove.rideCar)
          },
        },
        {
          content: "대중교통",
          onClick: () => {
            addChat({
              type: "my",
              content: "대중교통",
            })
            editRetreatAttendInformation("howToBack", HowToMove.goAlone)
          },
        },
      ],
    })
    setEditContent(EditContent.howToBack)
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

  function getKrFromHowToMove(howToMove: HowToMove) {
    switch (howToMove) {
      case HowToMove.together:
        return "버스"
      case HowToMove.driveCarWithPerson:
        return "자가용 (카풀 가능) 으"
      case HowToMove.driveCarAlone:
        return "자가용 (카풀 불가능) 으"
      case HowToMove.rideCar:
        return "카풀"
      case HowToMove.goAlone:
        return "대중교통으"
    }
    return ""
  }

  async function checkUserData() {
    const userData = userInformation
    await fetchRetreatAttendInformation(true)
    await fetchInOutInfo(true)
    if (!retreatAttend || !userData || !inOutInfos) {
      return
    }

    function dayToString(day: Days) {
      if (day === Days.firstDay) {
        return "금요일"
      } else {
        return "토요일"
      }
    }

    if (retreatAttend.isCanceled) {
      addChat({
        type: "bot",
        content: `${userInformation.name}님의 수련회 신청 내역은 취소되었어요.`,
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
연락은 ${userData.phone}로 드릴게요.
${getKrFromHowToMove(retreatAttend.howToGo)}로 수련회장으로 이동 하시고 
${getKrFromHowToMove(retreatAttend.howToBack)}로 교회로 돌아와요.
회비는 입금 ${retreatAttend.isDeposited ? "확인" : "대기중"} 입니다. 😀
${inOutInfos
  .map((inOutInfo) => {
    return `${dayToString(inOutInfo.day)} ${inOutInfo.time}시에 ${
      inOutInfo.position
    }${
      inOutInfo.inOutType === InOutType.IN ? "에서 들어오" : "로 나가"
    }실 거에요.`
  })
  .join("\n")}`,
      buttons: [
        {
          content: "엇.. 틀린게 있어요.",
          onClick: () => {
            addChat({
              type: "my",
              content: "엇.. 틀린게 있어요.",
            })
            selectEditContent()
          },
        },
        {
          content: "네! 좋아요.",
          onClick: async () => {
            addChat({
              type: "my",
              content: "네! 좋아요.",
            })
            await saveAllInformation()
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
          content: "출생년도",
          onClick: () => {
            addChat({
              type: "my",
              content: "출생년도",
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
        {
          content: "수련회장 가는 방법",
          onClick: () => {
            addChat({
              type: "my",
              content: "수련회장 가는 방법",
            })
            howToGo()
          },
        },
        {
          content: "수련회장에서 나오는 방법",
          onClick: () => {
            addChat({
              type: "my",
              content: "수련회장에서 나오는 방법",
            })
            howToBack()
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
      content: `말씀하신 대로 저장했어요!`,
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
          content: "접수 정보 확인",
          onClick: () => {
            addChat({
              type: "my",
              content: "접수 정보 확인",
            })
            checkUserData()
          },
        },
        {
          content: "접수 정보 수정",
          onClick: () => {
            addChat({
              type: "my",
              content: "접수 정보 수정",
            })
            selectEditContent()
          },
        },
        {
          content: "안내 사항",
          onClick: () => {
            addChat({
              type: "my",
              content: "안내 사항",
            })
          },
        },
        {
          content: "카풀 정보 수정",
          onClick: () => {
            addChat({
              type: "my",
              content: "카풀 정보 수정",
            })
            setShowInOutInfoForm(true)
          },
        },
      ],
    })
  }

  return {
    editContent,
  }
}
