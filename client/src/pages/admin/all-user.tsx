import { useEffect, useState } from "react";
import { Button, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { User } from '@entity/user'
import { get } from "pages/api";
import { InOutInfo } from "@server/src/entity/inOutInfo";

function AllUser () {
    const [allUserList, setAllUserList] = useState([] as Array<User>)

    useEffect(() => {
        get('/admin/get-all-user')
        .then((data) => setAllUserList(data))
    }, [])

    function downloadFile(){
        if(allUserList.length === 0){
            alert('접수자가 없습니다!.')
            return
        }

        const keys = Object.keys(allUserList[0])
        var textToSave = allUserList.map(user => Object.values(user).join(',')).join('\n');

        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:attachment/text,' + encodeURI(keys + '\n' + textToSave);
        hiddenElement.target = '_blank';
        hiddenElement.download = '전체 접수자.csv';
        hiddenElement.click();


        get('/admin/get-car-info')
        .then((data: InOutInfo[]) => {
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:attachment/text,' + encodeURI(JSON.stringify(data));
            hiddenElement.target = '_blank';
            hiddenElement.download = '출입 정보.txt';
            hiddenElement.click();
        })
    }

    return (
        <Stack>
            <Stack 
                direction="row" 
                alignItems="center"
                justifyContent="space-between"
            >
                <span>새벽이슬 동계 수련회</span>
                전체 사용자 목록 
                <Button 
                    variant="outlined"
                    style={{
                        marginLeft: '10px',
                    }}
                    onClick={downloadFile}
                >엑셀로 다운로드</Button>
            </Stack>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            이름
                        </TableCell>
                        <TableCell>
                            성별
                        </TableCell>
                        <TableCell>
                            나이
                        </TableCell>
                        <TableCell>
                            전화번호
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allUserList.map(user => (
                        <TableRow>
                            <TableCell>
                                {user.name}
                            </TableCell>
                            <TableCell>
                                {user.sex}
                            </TableCell>
                            <TableCell>
                                {user.age}
                            </TableCell>
                            <TableCell>
                                {user.phone}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Stack>
    )
}

export default AllUser