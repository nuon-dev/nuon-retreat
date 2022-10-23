import { useState } from "react"
import { 
  Button, 
  MenuItem, 
  Select, 
  Stack, 
  styled, 
  TextField } from "@mui/material"
import { useRouter } from "next/router"
import { post } from "./api"
import InOutFrom from "components/form/InOutForm"
import UserInformationForm from "components/form/UserInformationForm"


function index(){
  const router = useRouter()

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
      <UserInformationForm/>
    </Stack>
  )
}

export default index