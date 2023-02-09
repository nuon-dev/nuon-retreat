import { 
  Button, 
  Stack } from "@mui/material"
import { useRouter } from "next/router"
import UserInformationForm from "../components/form/UserInformationForm"
import { useState } from "react"


function index(){
  return (
    <Stack 
      textAlign="center"
      sx={{
        margin: '20px',
      }}
    >
      <h3>새벽이슬 2023 동계 수련회</h3>

      <UserInformationForm
        inOutData={[]}
      />
    </Stack>
  )
}

export default index