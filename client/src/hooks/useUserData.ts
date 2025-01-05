import { User } from "@entity/user"
import useKakaoHook from "kakao"
import { post } from "pages/api"
import { atom, useRecoilState, useSetRecoilState } from "recoil"
import useBotChatLogic, { EditContent } from "./useBotChatLogic"

export const UserInformationAtom = atom<User>({
  key: "user-information",
  default: undefined,
})

export default function useUserData() {
  const { getKakaoToken } = useKakaoHook()
  const [userInformation, setUserInformation] =
    useRecoilState(UserInformationAtom)

  async function getUserDataFromToken() {
    const token = localStorage.getItem("token")
    if (!token) {
      return undefined
    }
    const { result, userData } = await post("/auth/check-token", {
      token,
    })
    if (result === "true") {
      setUserInformation(userData)
      return userData
    }
    return undefined
  }

  async function getUserDataFromKakaoLogin() {
    try {
      var kakaoToken = await getKakaoToken()
      const { token } = await post("/auth/receipt-record", {
        kakaoId: kakaoToken,
      })
      localStorage.setItem("token", token)
      const { result, userData } = await post("/auth/check-token", {
        token,
      })
      if (result === "true") {
        setUserInformation(userData)
        return userData
      }
    } catch {
      return undefined
    }
    return undefined
  }

  type UserKey = keyof User
  function editUserInformation(key: UserKey, value: User[UserKey]) {
    setUserInformation((prev) => {
      return {
        ...prev,
        [key]: value,
      }
    })
  }

  async function saveUserInformation() {
    await post("/auth/edit-user", userInformation)
  }

  function checkMissedUserInformation(userInformation: User) {
    if (!userInformation) {
      return EditContent.none
    }
    if (!userInformation.name) {
      return EditContent.name
    } else if (!userInformation.age) {
      return EditContent.age
    } else if (!userInformation.phone) {
      return EditContent.phone
    } else if (!userInformation.sex) {
      return EditContent.sex
    } else if (!userInformation.darak) {
      return EditContent.darak
    } else if (!userInformation.village) {
      return EditContent.village
    }
    return EditContent.none
  }

  return {
    getUserDataFromToken,
    getUserDataFromKakaoLogin,
    editUserInformation,
    saveUserInformation,
    checkMissedUserInformation,
  }
}
