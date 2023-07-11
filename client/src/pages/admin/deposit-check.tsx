import { Button, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { AttendType } from "../../types"
import { User } from "@entity/user"
import { get, post } from "../../pages/api"
import { useEffect, useState } from "react"

function DepositCheck (){

    const [allUserList, setAllUserList] = useState([] as Array<User>)
    const [isShowUnpaid, setIsShowUnpaid] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])


    async function DepositProcessing(userId: number){
        const result =  await post('/admin/deposit-processing', {
            userId
        })

        if(result.result === "error"){
            alert('오류 발생!')
            return
        }

        fetchData()
    }

    function fetchData(){
        get('/admin/get-all-user')
        .then((data) => setAllUserList(data))
    }

    function clickFilter() {
        if(isShowUnpaid){
           fetchData()
        }else{
            setAllUserList(allUserList.filter(user => !user.deposit))
        }
        setIsShowUnpaid(!isShowUnpaid)
    }

    return(
        <Stack>
            <Stack
                style={{
                    margin: '12px'
                }}
            >
                <Button
                    onClick={clickFilter}
                    variant="contained"
                >
                    {isShowUnpaid ? '전체보기' : '미납금자만 보기'}
                </Button>
            </Stack>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            이름
                        </TableCell>
                        <TableCell>
                            참석 유형
                        </TableCell>
                        <TableCell>
                            접수 일자
                        </TableCell>
                        <TableCell>
                            전화번호
                        </TableCell>
                        <TableCell>
                            입금 유무
                        </TableCell>
                        <TableCell>
                            입금 처리
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allUserList.map(user => {
                        const createDate = new Date(user.createAt.toString())
                        return (
                        <TableRow>
                            <TableCell>
                                {user.name}
                            </TableCell>
                            <TableCell
                            /*
                            // @ts-ignore */>
                                {user.attendType === AttendType.full ? '전참' : '부참'}
                            </TableCell>
                            <TableCell>
                                {`${createDate.getFullYear()}-${createDate.getMonth()+1}-${createDate.getDate()} ${createDate.getHours()}:${createDate.getMinutes()}:${createDate.getSeconds()}`}
                            </TableCell>
                            <TableCell>
                                {user.phone}
                            </TableCell>
                            <TableCell>
                                {user.deposit ? 'Y' : 'N'}
                            </TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => DepositProcessing(user.id)}
                                    variant="contained" 
                                    color={user.deposit ? "error" : "success"}
                                >
                                    {user.deposit ? '취소 처리' : '완료 처리'}
                                </Button>
                            </TableCell>
                        </TableRow>
                    )}
                    )}
                </TableBody>
            </Table>
        </Stack>
    )
}

export default DepositCheck