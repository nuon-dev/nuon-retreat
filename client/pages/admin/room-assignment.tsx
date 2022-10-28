import { Box, Stack } from "@mui/material";
import { User } from "@entity/user";
import { useEffect, useState } from "react";
import { get, post } from "pages/api";


function RoomAssingment (){
    const [unassignedUserList, setUnassignedUserList] = useState([] as Array<User>)
    const [roomList, setRoomList] = useState([] as Array<Array<User>>)
    const [selectedUser, setSelectedUser] = useState<User>()
    const [maxRoomNumber, setMaxRoomNumber] = useState(0)

    useEffect(() => {
        fetchData()
    }, [])

    function fetchData(){
        get('/admin/get-room-assignment')
        .then((response: Array<User>) => {
            const unassignedUserList = response.filter(user => user.roomAssignment.isUpdated || user.roomAssignment.roomNumber === 0)
            setUnassignedUserList(unassignedUserList)

            const room = [] as Array<Array<User>>
            const assignedUserList = response.filter(user => !user.roomAssignment.isUpdated)
            assignedUserList.map(user => {
                const roomNumber = user.roomAssignment.roomNumber - 1
                if(!room[roomNumber]){
                    room[roomNumber] = [user]
                }else{
                    room[roomNumber].push(user)
                }
                setRoomList(room)
            })
            const maxNumer = Math.max(...response.map(user => user.roomAssignment.roomNumber))
            setMaxRoomNumber(maxNumer)
        })
    }

    function unassignedUserRow(user: User) {
        return (<Stack 
            direction="row"
            onMouseDown={() => setSelectedUser(user)}
            onMouseUp={() => setRoom(0)}
            sx={{
                border: "1px solid black"
            }}
        >
            <Box>{user.name}</Box>
            <Box>{user.age}</Box>
            <Box>{user.sex}</Box>
            <Box>{user.roomAssignment.roomNumber}</Box>
        </Stack>)
    }

    function userRoomRow(user: User){
        return (<Stack
            direction="row"
            onMouseDown={() => setSelectedUser(user)}
         >
            <Box>{user.name}</Box>
            <Box>{user.age}</Box>
            <Box>{user.sex}</Box>
        </Stack>)
    }

    function roomData(userList: Array<User>){
        return (<Stack
            sx={{
                minHeight: "20px",
                border: "1px solid black"
            }}
            onMouseUp={() => setRoom(userList[0].roomAssignment.roomNumber)}
        >
            <Stack>{userList[0].roomAssignment.roomNumber}번 방</Stack>
            {userList.map(user => userRoomRow(user))}
        </Stack>)
    }

    async function setRoom(roomNumber: number){
        if(!selectedUser){
            return
        }
        selectedUser.roomAssignment.roomNumber = roomNumber
        selectedUser.roomAssignment.isUpdated = false
        await post('/admin/set-room', {
            roomAssignment: selectedUser.roomAssignment,
        })
        fetchData()
    }

    return (
        <Stack direction="row">
            <Stack width="200px">
                {unassignedUserList.map(user => unassignedUserRow(user))}
            </Stack>
            <Stack direction="row">
                {roomList.map(room => roomData(room))}
                <Stack 
                sx={{
                    minHeight: "20px",
                    border: "1px solid black"
                }}
                    onMouseUp={() => setRoom(maxRoomNumber + 1)}>
                    {maxRoomNumber + 1}번방
                </Stack>
            </Stack>
        </Stack>
    )
}

export default RoomAssingment