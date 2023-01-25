import { 
  Button, 
  Stack } from "@mui/material"
import { useRouter } from "next/router"
import UserInformationForm from "../components/form/UserInformationForm"
import { useEffect } from "react"
import { post } from "./api"


function index(){
  const router = useRouter()

  const goToEditPage = () => {
    router.push('/edit')
  }

  useEffect(() => {
    checkToken()
  }, [])

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


  return (
    <Stack 
      textAlign="center"
      sx={{
        margin: '20px',
      }}
    >
      새벽이슬 2023 동계 수련회
      <Button
        sx={{
          mt: '16px',
        }}
        onClick={goToEditPage}
      >
        접수 내역 수정하기
      </Button>
      <UserInformationForm
        inOutData={[]}
      />
    </Stack>
  )
}

export default index