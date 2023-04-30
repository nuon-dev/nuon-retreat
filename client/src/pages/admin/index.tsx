import { post } from "../../pages/api"
import { useEffect, useState } from "react"
import { Button, Stack, TextField } from "@mui/material/index"
import { useRouter } from "next/router"
import { ST } from "next/dist/shared/lib/utils"
import useKakaoHook from "kakao"

function admin () {
    const router = useRouter()
    const kakao = useKakaoHook()

    const [isLogin, setIsLogin] = useState(false)

    const goToPage =(path: string) => {
        router.push(`/admin/${path}`)
    }
    
    useEffect(() => {
        const token = localStorage.getItem('token')
        post('/auth/check-token', {
            token,
        }).then(respone => {
            if(respone.result === "true"){
                setIsLogin(true)
            }
        })
    }, [])

    function logout(){
        localStorage.clear()
        router.reload()
    }

    const menu = () => {
        return (
        <Stack>
            <Stack
                margin="12px"
                justifyContent="center"
                alignItems="center"
                direction="row"
            >
                <Button
                    variant="contained"
                onClick={() => goToPage('/all-user')} 
                >
                    접수자 전체 조회
                </Button>
                <Stack margin="4px"/>
                <Button
                    variant="contained"
                onClick={() => goToPage('/carpooling')} 
                >
                    카풀 관리
                </Button>
                <Stack margin="4px"/>
                <Button
                    variant="contained"
                onClick={() => goToPage('/room-assignment')} 
                >
                    방배정 관리
                </Button>
                <Stack margin="4px"/>
                <Button
                    variant="contained"
                onClick={() => goToPage('/group-formation')} 
                >
                    조배정 관리
                </Button>
                <Stack margin="4px"/>
                <Button
                    variant="contained"
                onClick={() => goToPage('/permission-manage')} 
                >
                    권한 관리
                </Button>
                <Stack margin="4px"/>
                <Button
                    variant="contained"
                    onClick={() => goToPage('/reset-password')}
                >
                    비밀번호 초기화
                </Button>
                <Stack margin="4px"/>
                <Button
                    variant="contained"
                    onClick={() => goToPage('/deposit-check')}
                >
                    입금 확인 처리
                </Button>
                <Stack margin="4px"/>
                <Button
                    variant="contained"
                    onClick={() => goToPage('/dash-board')}
                >
                    대시보드
                </Button>
            </Stack>
            <Stack 
                alignContent="center"
                padding="40px"
            >
                <Button
                    onClick={logout}
                    variant="contained"
                >
                    로그아웃
                </Button>
            </Stack>
        </Stack>)
    }

    async function kakaoLogin(){
        const kakaoToken = await kakao.getKakaoToken()
        const {token} = await post('/auth/receipt-record', {
            kakaoId: kakaoToken
        })
        localStorage.setItem("token", token)
        setIsLogin(true)
    }

    const loginForm = () => {
        return (<Stack padding="6px">
            관리자 화면
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
        </Stack>)
    }

    return (
        <Stack>
            {isLogin ? menu() : loginForm()}
        </Stack>
    )
}

export default admin