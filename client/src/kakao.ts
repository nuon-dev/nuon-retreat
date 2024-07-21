import { useEffect } from "react"

export default function useKakaoHook() {
  const globalValue: any = global
  var Kakao: any = globalValue.Kakao
  useEffect(() => {
    if (!Kakao) {
      alert("필수 라이브러리 로딩 실패, 다른 브라우저를 이용해주세요.")
    }
  }, [])

  function getKakaoToken() {
    return new Promise((resolve, reject) => {
      Kakao.Auth.login({
        success: function (response: Response) {
          Kakao.API.request({
            url: "/v2/user/me",
            success: function (response: { id: number }) {
              resolve(response.id)
            },
            fail: function (error: any) {
              reject(error)
            },
          })
        },
        fail: function (error: any) {
          reject(error)
        },
      })
    })
  }

  return {
    getKakaoToken,
  }
}
