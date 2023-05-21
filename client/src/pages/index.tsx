import { Button, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { get, post } from "./api";
import useKakaoHook from "kakao";
import { useEffect } from "react";

function index(){
    const router = useRouter()
    const kakao = useKakaoHook()

    useEffect(() => {
      checkToken()
    }, [])

    function checkToken(){
        const token = localStorage.getItem('token')
        
        if(!token){
          return
        }
    
        post('/auth/check-token', {
          token,
        }).then(respone => {
            if(respone.result === "true"){
              const userAnswer = confirm('로그인 이력이 있습니다.\n이동하시겠습니까?')
              if(userAnswer){
                router.push('/edit')
              }
            }
        })
      }

      async function kakaoLogin(){
        const kakaoToken = await kakao.getKakaoToken()
        const {token} = await post('/auth/receipt-record', {
            kakaoId: kakaoToken
        })
        localStorage.setItem("token", token)
        router.push('/edit')
      }

    return (
    <Stack
        style={{
            margin: '10px',
            height: '100vh',
        }}
        alignItems="center"
        justifyContent="center"
    >
      <h2>2023 새벽이슬 하계 수련회</h2>
      <Button
          style={{
            marginTop: "30vh",
            marginBottom: "20vh",
            backgroundColor: "#FEE500",
            color: "#191919",
            height: "60px",
            width: "240px",
            borderRadius: "12px",
            fontSize: "24px",
            fontWeight: "bold"
          }}
          onClick={kakaoLogin}
      >
          카카오 로그인
      </Button>
    </Stack>
    )
}

export default index