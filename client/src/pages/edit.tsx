import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { post } from "./api";
import { User } from "@entity/user"
import { Button, TextField } from "@mui/material";
import UserInformationForm from "../components/form/UserInformationForm";
import { InOutInfo } from "@entity/inOutInfo";

export default function Edit () {
    const [isLogin, setIsLogin] = useState(false) 
    const [userData, setUserData] = useState({} as User)
    const [inOutData, setInOutData] = useState<Array<InOutInfo>>([])
    
    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token){
            checkToken(token);
        }
    }, [])

    const checkToken = (token: string) => {
        post('/auth/check-token', {
            token,
        }).then(respone => {
            if(respone.result === "true"){
                setIsLogin(true)
                setUserData(respone.userData)
                setInOutData(respone.inoutInfoList)
            }
        })
    }
    
    function logout(){
        setIsLogin(false)
    }

    return (
    <Stack margin="4px">
        {isLogin && 
        <Stack>
            <Stack 
                justifyContent="center"
                alignItems="center"
                padding="5px"
                border="1px solid black"
                borderRadius="5px"
            >
                선착순에 {userData.firstCome ? '성공' : '실패'}하셨습니다!.
            </Stack>
            <Stack 
                justifyContent="center"
                alignItems="center"
                padding="5px"
                border="1px solid black"
                borderRadius="5px"
                marginTop="10px"
            >
                 입금 처리가 {userData.deposit ? '완료 되었습' : '진행 중입'}니다.
            </Stack>
            <UserInformationForm
                user={userData}
                inOutData={inOutData}
             />
            <Stack>
                <Button onClick={logout}>
                    다른 정보 수정하기
                </Button>
            </Stack>
        </Stack>}
    </Stack>)
}