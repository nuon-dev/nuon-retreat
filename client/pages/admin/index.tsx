import { Button, Stack } from "../../node_modules/@mui/material/index"
import { useRouter } from "../../node_modules/next/router"

function admin () {
    const router = useRouter()
    const showAllUser = () => {
        router.push('/admin/all-user')
    }
    return (
        <Stack>
            <Button
               onClick={showAllUser} 
            >
                접수자 전체 조회
            </Button>
        </Stack>
    )
}

export default admin