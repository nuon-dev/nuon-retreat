import { 
  Button, 
  Stack } from "@mui/material"
import { useRouter } from "next/router"
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
      새벽이슬 2023 동계 수련회
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