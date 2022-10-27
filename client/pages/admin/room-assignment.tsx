import { Box, Stack } from "@mui/material";
import { User } from "@entity/user";
import { useEffect, useState } from "react";
import { get } from "pages/api";

function RoomAssingment (){
    const [unassignedUserList, setUnassignedUserList] = useState([] as Array<User>)


    useEffect(() => {
        fetchData()
    }, [])

    function fetchData(){
        get('/admin//get-room-assignment')
        .then(response => {
            console.log(response)
        })
    }

    return (
        <Stack>
            <Stack>
                {unassignedUserList.map(user => <Box>{user.name}</Box>)}
            </Stack>
        </Stack>
    )
}

export default RoomAssingment