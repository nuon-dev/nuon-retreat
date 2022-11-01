import { Box, Button, Stack } from "@mui/material";
import { User } from "@entity/user";
import { useEffect, useState } from "react";
import { get, post } from "pages/api";


function RoomAssingment (){
    const [unassignedUserList, setUnassignedUserList] = useState([] as Array<User>)
    const [roomList, setRoomList] = useState([] as Array<Array<User>>)
    const [selectedUser, setSelectedUser] = useState<User>()
    const [maxRoomNumber, setMaxRoomNumber] = useState(0)
    const [sex, setSex] = useState('man')

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
                border: "1px solid black",
                justifyContent: 'space-between',
                backgroundColor: user.sex === 'man' ? "lightblue" : "pink",
            }}
        >
            <Box>{user.name}({user.age})</Box>
            <Box>{user.roomAssignment.roomNumber}</Box>
        </Stack>)
    }

    function userRoomRow(user: User){
        return (<Stack
            direction="row"
            onMouseDown={() => setSelectedUser(user)}
            width="200px"
            sx={{
                justifyContent: 'space-between',
                backgroundColor: user.sex === 'man' ? "lightblue" : "pink",
            }}
         >
            <Box>{user.name}({user.age})</Box>
            <Box>{user.attendType}</Box>
        </Stack>)
    }

    function Room(roomNumber: number, userList: Array<User>){
        return (<Stack
            sx={{
                minHeight: "20px",
                border: "1px solid black"
            }}
            onMouseUp={() => setRoom(roomNumber)}
        >
            <Stack>{roomNumber}번 방 ({userList.filter(user => user.sex === sex).length})</Stack>
            {userList.filter(user => user.sex === sex).map(user => userRoomRow(user))}
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
        <Stack>
            <Stack>
                {sex === 'man' ? "남자" : "여자"} 방배정 
                <Button onClick={() => setSex(sex === 'man' ?  "woman" : "man")}>성별 변경</Button>
            </Stack>
            <Stack direction="row">
                <Stack width="200px">
                    <Box>미배정({unassignedUserList.filter(user => user.sex === sex).length}명)</Box>
                    {unassignedUserList.filter(user => user.sex === sex).map(user => unassignedUserRow(user))}
                </Stack>
                <Stack direction="row">
                    { new Array(maxRoomNumber).fill(0).map((_, index) => {
                        const room = roomList[index]
                        if(!room || room.length === 0){
                            return Room(index + 1, [])
                        }else{
                            return Room(room[0].roomAssignment.roomNumber, room)
                        }
                    })
                    }
                    {
                        Room(maxRoomNumber + 1, [])
                    }
                </Stack>
            </Stack>
        </Stack>
    )
}

export default RoomAssingment