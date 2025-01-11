import useKakaoHook from "kakao"
import { post } from "pages/api"
import { atom, useRecoilState, useSetRecoilState } from "recoil"
import useBotChatLogic, { EditContent } from "./useBotChatLogic"
import { User } from "@server/entity/user"

export const UserInformationAtom = atom<User>({
  key: "user-information",
  default: undefined,
})

export default function useUserData() {
  const { getKakaoToken } = useKakaoHook()
  const [userInformation, setUserInformation] =
    useRecoilState(UserInformationAtom)

  async function getUserDataFromToken(): Promise<User | undefined> {
    const token = localStorage.getItem("token")
    if (!token) {
      return undefined
    }
    const { result, userData } = await post("/auth/check-token", {
      token,
    })
    if (result === "true") {
      console.log(userData)
      setUserInformation(userData)
      return userData
    }
    return undefined
  }

  async function getUserDataFromKakaoLogin(): Promise<User | undefined> {
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
    await post("/auth/edit-my-information", userInformation)
  }

  function checkMissedUserInformation(userInformation: User) {
    if (!userInformation) {
      return EditContent.none
    }
    if (!userInformation.name) {
      return EditContent.name
    } else if (!userInformation.yearOfBirth) {
      return EditContent.yearOfBirth
    } else if (!userInformation.phone) {
      return EditContent.phone
    } else if (!userInformation.gender) {
      return EditContent.gender
    } else if (!userInformation.group) {
      return EditContent.darak
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
