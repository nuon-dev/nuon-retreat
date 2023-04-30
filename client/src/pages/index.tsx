import { Button, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { get, post } from "./api";
import useKakaoHook from "kakao";

function index(){
    const router = useRouter()
    const kakao = useKakaoHook()
    function checkToken(){
        const token = localStorage.getItem('token')
        
        if(!token){
          return
        }
    
        post('/auth/check-token', {
          token,
        }).then(respone => {
            if(respone.result === "true"){
              const userAnswer = confirm('접수 내용이 있습니다. 접수 내용을 수정하시겠습니까?')
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
        console.log(token)
        localStorage.setItem("token", token)
        router.push('/edit')
      }

    return (
    <Stack
        style={{
            margin: '10px',
            height: '100vh',
        }}
        direction="row"
        alignItems="center"
        justifyContent="center"
    >
        <Button
            style={{
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