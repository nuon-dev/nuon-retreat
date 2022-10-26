import { post } from "pages/api"
import { useEffect, useState } from "react"
import { Button, Stack, TextField } from "../../node_modules/@mui/material/index"
import { useRouter } from "../../node_modules/next/router"

function admin () {
    const router = useRouter()

    const [isLogin, setIsLogin] = useState(false)

    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')

    const showAllUser = () => {
        router.push('/admin/all-user')
    }

    const goToResetPasswordPage = () => {
        router.push('/admin/reset-password')
    }

    const goToCarpoolingPage = () => {
        router.push('/admin/carpooling')
    }

    const goToPermissionManagePage = () => {
        router.push('/admin/permission-manage')
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
               onClick={showAllUser} 
            >
                접수자 전체 조회
            </Button>
            <Button
                variant="contained"
               onClick={goToCarpoolingPage} 
            >
                카풀 관리
            </Button>
            <Button
                variant="contained"
               onClick={goToPermissionManagePage} 
            >
                권한 관리
            </Button>
            <Button
                variant="contained"
                onClick={goToResetPasswordPage}
            >
                비밀번호 초기화
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