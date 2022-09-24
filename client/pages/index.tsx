import { useState } from "react"
import { 
  Button, 
  MenuItem, 
  Select, 
  Stack, 
  styled, 
  TextField } from "@mui/material"
import { useRouter } from "next/router"


function index(){
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [userPassword, setPassword] = useState('')
  const [userAge, setUserAge] = useState<number>()
  const [userPhone, setUserPhone] = useState('')
  const [userSex, setUserSex] = useState('man')

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
        userPassword,
        userSex,
      })
    })
  }

  const goToEditPage = () => {
    router.push('/edit')
  }

  return (
    <Stack 
      textAlign="center"
      sx={{
        margin: '20px',
      }}
    >
      새벽이슬 2022 동계 수련회
      <Button
        variant="contained"
        sx={{
          mt: '16px',
        }}
        onClick={goToEditPage}
      >
        접수 내역 수정하기
      </Button>
      <Stack 
        sx={{
          mt: '16px',
        }}
      >
        <Field
          label="이름"
          onChange={e => setUserName(e.target.value)}
        />
        <Field
          label="비밀번호"
          type="password"
          onChange={e => setPassword(e.target.value)}
        />
        <Field
          label="나이"
          type="number"
          onChange={e => setUserAge(e.target.value)}
          />
          <Select
            value={userSex}
            label="성별"
            onChange={e => setUserSex(e.target.value)}
            sx={{
              mt: '12px'
            }}
          >
            <MenuItem value={'man'}>
              남
            </MenuItem>
            <MenuItem value={'woman'}>
              여
            </MenuItem>
          </Select>
        <Field
          label="전화번호"
          onChange={e => setUserPhone(e.target.value)}
          />
        <Button 
          variant="outlined"
          onClick={submit}
          sx={{mt: '12px',}}
        >
          저장
        </Button>
      </Stack>
    </Stack>
  )
}

export default index

const Field = styled(TextField)({
  marginTop: '12px'
})