import { post } from "pages/api"
import { useEffect, useState } from "react"
import { Button, Stack, TextField } from "@mui/material/index"
import { useRouter } from "next/router"

function admin () {
    const router = useRouter()

    const [isLogin, setIsLogin] = useState(false)

    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')

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

    const menu = () => {
        return (<>
            <Button
                variant="contained"
               onClick={() => goToPage('/all-user')} 
            >
                접수자 전체 조회
            </Button>
            <Button
                variant="contained"
               onClick={() => goToPage('/carpooling')} 
            >
                카풀 관리
            </Button>
            <Button
                variant="contained"
               onClick={() => goToPage('/room-assignment')} 
            >
                방배정 관리
            </Button>
            <Button
                variant="contained"
               onClick={() => goToPage('/group-formation')} 
            >
                조배정 관리
            </Button>
            <Button
                variant="contained"
               onClick={() => goToPage('/permission-manage')} 
            >
                권한 관리
            </Button>
            <Button
                variant="contained"
                onClick={() => goToPage('/reset-password')}
            >
                비밀번호 초기화
            </Button>
            <Button
                variant="contained"
                onClick={() => goToPage('/dash-board')}
            >
                대시보드
            </Button>
        </>)
    }

    const login = async () => {
        const result = await post('/auth/login', {
            userName,
            userPassword,
        })
        if(result.result === "success"){
            localStorage.setItem('token', result.token)
            setIsLogin(true)
        }else{
            alert('로그인 실패!')
        }
    }

    const loginForm = () => {
        return (<Stack>
            <TextField 
                label="이름"
                onChange={e => setUserName(e.target.value)}
            />
            <TextField 
                label="비밀번호"
                onChange={e => setUserPassword(e.target.value)}
            />
            <Button
                variant="contained"
                onClick={login}
            >
                로그인
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