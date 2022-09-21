import { useEffect, useState } from "react";
import { Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { User } from '@entity/user'

function AllUser () {
    const [allUserList, setAllUserList] = useState([] as Array<User>)


    useEffect(() => {
        fetch('/api/get/all-user')
        .then((request) => {
                request.json()
                .then(data => setAllUserList(data))
        })
    }, [])

    return (
        <Stack>
            전체 사용자 목록
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