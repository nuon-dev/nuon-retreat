import { 
  Button, 
  Stack } from "@mui/material"
import { useRouter } from "next/router"
import UserInformationForm from "../components/form/UserInformationForm"
import { useEffect, useState } from "react"
import { post } from "./api"


function index(){
  const [currentTime, setCurrentTime] = useState<Date>(new Date(2023, 0, 29, 13))
  const targetDate = new Date(2023, 0, 29, 13)
  const router = useRouter()

  const goToEditPage = () => {
    router.push('/edit')
  }

  useEffect(() => {
    checkToken()
    setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
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

  const leftTime = targetDate.getTime() - currentTime.getTime()
  const d = Math.floor(leftTime / (24 * 60 * 60 * 1000))
  const h = Math.floor(leftTime / (60 * 60 * 1000) - d * 24)
  const m = Math.floor(leftTime / (60 * 1000) - d * 24 * 60 - h * 60)
  const s = Math.floor(leftTime / 1000 - d * 24 * 60 * 60 - h * 60 * 60 - m * 60)

  return (
    <Stack 
      textAlign="center"
      sx={{
        margin: '20px',
      }}
    >
      <h3>새벽이슬 2023 동계 수련회</h3>
      {leftTime > 0 &&
        <Stack>
          <p/>
          <h3>{`${targetDate.getFullYear()}년 ${targetDate.getMonth() + 1}월 ${targetDate.getDate()}일 ${targetDate.getHours()}시에`}<br/>신청 할 수 있습니다.</h3>
          <br/>
          <h3>남은 시간 / {d}일 {h}시 {m}분 {s}초</h3>
          시간이 완료되면 자동으로 접수창이 생깁니다!.
          <br/>새로고침 하지 마세요! (하면 더 느려져요!!)
        </Stack>}


      { leftTime < 0 &&
        <Stack>
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
      }
    </Stack>
  )
}

export default index