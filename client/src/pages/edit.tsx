import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { post } from "./api";
import { User } from "@entity/user"
import UserInformationForm from "../components/form/UserInformationForm";
import { InOutInfo } from "@entity/inOutInfo";

export default function Edit () {
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
        }).then(response => {
            if(response.result === "true"){
                setUserData(response.userData)
                setInOutData(response.inoutInfoList)
            }
        })
    }
    
    return (
    <Stack margin="8px">
        <Stack
            alignItems="center"
            justifyContent="center"
        >
            {userData.deposit ? <Stack>
                입금 처리가 {userData.deposit ? '완료 되었습' : '진행 중입'}니다.
                </Stack>:
                <Stack
                maxWidth="400px"
                padding="5px"
                marginTop="10px"
                bgcolor="#03C0A4"
                borderRadius="5px"
                textAlign="center"
                alignItems="center"
                justifyContent="center"
                border="1px solid 008000"
                >
                    <Stack fontSize="20px" fontWeight="bold" color="whitesmoke">수련회비 안내</Stack>
                    <Stack color="white" mt="6px"> 3333276342153 카카오뱅크
                    <br/>전참 5만 / 금요일 저녁 이후 참석 3만</Stack>
                </Stack>}
            <UserInformationForm
                user={userData}
                inOutData={inOutData}
             />
        </Stack>
    </Stack>)
}