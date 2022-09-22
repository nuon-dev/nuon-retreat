import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { post } from "pages/api";
import { useState } from "react";

export default function ResetPassword () {
    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')

    const reset = async () => {
        const result = await post('/reset-password', {
            userName,
            userPassword
        })
        console.log(result)
    }

    return (
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
            onClick={reset}
            variant="contained"
        >
            재설정
        </Button>
    </Stack>)
}