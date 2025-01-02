import useKakaoHook from "kakao"
import { post } from "pages/api"

export default function useUserData() {
  const { getKakaoToken } = useKakaoHook()

  async function getUserDataFromToken() {
    const token = localStorage.getItem("token")
    if (!token) {
      return undefined
    }
    const { result, userData } = await post("/auth/check-token", {
      token,
    })
    if (result === "true") {
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
        return userData
      }
    } catch {
      return undefined
    }
    return undefined
  }

  return {
    getUserDataFromToken,
    getUserDataFromKakaoLogin,
  }
}
