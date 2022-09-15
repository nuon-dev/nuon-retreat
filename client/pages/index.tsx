import { useEffect, useState } from "react"
import { Button, Input, Stack, TextField } from "../node_modules/@mui/material/index"


function index(){
  const [userName, setUserName] = useState('test')
  const [userAge, setUserAge] = useState<number>(20)
  const [userPhone, setUserPhone] = useState('010')
  
  const result = async () => {
    const result = await fetch('/api/get/test')
    console.log(await result.json())
  }

  const submit = async () => {
    const header = new Headers();
    header.append("Content-Type", "application/json")
    const result = await fetch('/api/post/regist-user',{
      method: "POST",
      headers: header,
      body: JSON.stringify({
        userName,
        userAge,
        userPhone,
      })
    })

    console.log(result)
  }

  return (
    <Stack>
      {userName}?
      <Button>
        수정하기
      </Button>
      <TextField
        label="이름"
        onChange={e => setUserName(e.target.value)}
      />
      <TextField
        label="나이"
        onChange={e => setUserAge(e.target.value)}
      />
      <TextField
        labe="전화번호"
        onChange={e => setUserPhone(e.target.value)}
      />
      <Button onClick={submit}>
        저장
      </Button>
    </Stack>
  )
}

export default index
