import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { post } from "./api";
import { User } from "@entity/user"
import { Button, TextField } from "@mui/material";
import UserInformationForm from "components/form/UserInformationForm";

export default function Edit () {
    const [isLogin, setIsLogin] = useState(false) 
    const [userData, setUserData] = useState({} as User)
    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')
    
    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token){
            checkToken(token);
        }
    }, [])

    const checkToken = (token: string) => {
        post('/check-token', {
            token,
        }).then(respone => {
            if(respone.result === "true"){
                setIsLogin(true)
                setUserData(respone.userData)
            }
        })
    }

    const getUserData = async () => {
        const respone = await post('/login', {
            userName,
            userPassword
        })
        if(respone.result !== 'success'){
            alert('아이디 및 비밀번호가 틀렸습니다.')
            return
        }

        localStorage.setItem('token', respone.token)
        checkToken(respone.token)
    }
    
    return (
    <Stack>
        {isLogin && <UserInformationForm user={userData}/>}
        {!isLogin && 
            <Stack>
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
                    onClick={getUserData}
                >
                    정보 불러오기
                </Button>
            </Stack>
        }
    </Stack>)
}