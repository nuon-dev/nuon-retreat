import { useEffect } from "react";

export default function useKakaoHook(){
    const globalValue: any = global
    var Kakao: any = globalValue.Kakao
    useEffect(() => {
        if(!Kakao.isInitialized()){
            Kakao.init('24c68e47fc07af3735433d60a3c4f4b3'); //발급받은 키 중 javascript키를 사용해준다.
        }
    },[])

    function getKakaoToken() {
        return new Promise((resolve, reject) => {
            Kakao.Auth.login({
                success: function (response: Response) {
                  Kakao.API.request({
                    url: '/v2/user/me',
                    success: function (response: {id: number}) {
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
        getKakaoToken
    }
}