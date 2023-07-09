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
        }).then(response => {
            if(response.result === "true"){
              router.push('/edit')
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

     async function normalLogin() {
      const randomId = Math.floor(Math.random() * 10000000);
            const {token} = await post('/auth/receipt-record', {
        kakaoId: 'normal'+randomId
      })
      localStorage.setItem("token", token)
      router.push('/edit')
     }

    return (
    <Stack
        style={{
            height: '100vh',
            backgroundImage: 'url(/main_bg.png)',
            backgroundSize: '100%',
        }}
        alignItems="center"
        justifyContent="center"
    >
      <Stack fontSize="24px" color="#3F3F3F">2023 새벽이슬 하계 수련회</Stack>
      <Stack style={{
        marginTop: "60vh",
      }}>
        <Button
            style={{
              backgroundColor: "#FEE500",
              color: "#191919",
              height: "50px",
              width: "240px",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: "bold"
            }}
            onClick={kakaoLogin}
        >
            카카오로 접수하기
        </Button>
        <Button
            style={{
              backgroundColor: "#DDD",
              color: "#191919",
              height: "50px",
              width: "240px",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: "bold",
              marginTop: '20px',
            }}
            onClick={normalLogin}
        >
            일반 접수하기
        </Button>
      </Stack>
    </Stack>
    )
}

export default index