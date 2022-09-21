import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { User } from '@entity/user'

function AllUser () {
    const [allUserList, setAllUserList] = useState([] as Array<User>)


    useEffect(() => {

        fetch('/api/get/all-user')
        .then(
            (request) => {
                request.json()
                .then(data => setAllUserList(data))
            }
            )
    }, [])

    return (
        <Stack>
            전체 사용자 목록
            {allUserList.map(user => {
                return (
                    <Stack direction="row">
                        {user.name} {user.age} {user.id} {user.phone} {user.sex}
                    </Stack>
                )
            })}
        </Stack>
    )
}

export default AllUser