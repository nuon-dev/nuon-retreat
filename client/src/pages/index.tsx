import { Button, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { post } from "./api";

function index(){
    const router = useRouter()

    function onClickGoToEdit() {
        router.push('/edit')
    }

    function onClickGoToInsert(){
        checkToken()
        
        router.push('/insert')
    }

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
        style={{
            margin: '10px',
            height: '100vh',
        }}
        direction="row"
        alignItems="center"
        justifyContent="center"
    >
        <Button
            variant="contained"
            style={{
                height: '100px',
            }}
            onClick={onClickGoToEdit}
        >접수 내용 수정하기</Button>
        <div 
            style={{
                margin: '10px',
            }}
        />        
        <Button
            onClick={onClickGoToInsert}
            style={{
                height: '100px'
            }}
            variant="contained"
        >새로 접수하기</Button>
    </Stack>
    )
}

export default index