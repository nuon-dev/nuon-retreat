import { useEffect, useState } from "react";
import { Stack } from "@mui/material";

function AllUser () {

    const [allUserList, setAllUserList] = useState([])


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
                        <Stack>
                            {user.name}
                        </Stack>
                        <Stack>
                            {user.age}
                        </Stack>
                    </Stack>
                )
            })}
        </Stack>
    )
}

export default AllUser