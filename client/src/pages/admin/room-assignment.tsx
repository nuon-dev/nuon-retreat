import { Box, Button, Stack } from "@mui/material";
import { User } from "@entity/user";
import { useEffect, useState } from "react";
import { get, post } from "../../pages/api";
import { InOutInfo } from "@entity/inOutInfo";
import { margin, style } from "@mui/system";


function RoomAssingment (){
    const [unassignedUserList, setUnassignedUserList] = useState([] as Array<User>)
    const [roomList, setRoomList] = useState([] as Array<Array<User>>)
    const [selectedUser, setSelectedUser] = useState<User>()
    const [maxRoomNumber, setMaxRoomNumber] = useState(0)
    const [isShowUserInfo, setIsShowUserInfo] = useState(false)
    const [showUserInfo, setShowUserInfo] = useState({} as User)
    const [userAttendInfo, setUserAttendInfo] = useState([] as Array<InOutInfo>)
    const [userAttendInfoCache, setUserAttendInfoCache] = useState([] as Array<Array<InOutInfo>>)
    const [mousePoint, setMousePoint] = useState([0,0])
    const [sex, setSex] = useState('man')

    function onMouseMove(event: MouseEvent) {
        setMousePoint([event.pageX, event.pageY])
    }

    useEffect(() => {
        fetchData()
        addEventListener('mousemove', onMouseMove);

        return () => {
            removeEventListener('mousemove', onMouseMove)
        }
    }, [])

    function fetchData(){
        get('/admin/get-room-assignment')
        .then((response: Array<User>) => {
            const unassignedUserList = response.filter(user => !user.roomAssignment || user.roomAssignment.isUpdated || user.roomAssignment.roomNumber === 0)
            setUnassignedUserList(unassignedUserList)

            const room = [] as Array<Array<User>>
            const assignedUserList = response.filter(user => user.roomAssignment && !user.roomAssignment.isUpdated)
            assignedUserList.map(user => {
                const roomNumber = user.roomAssignment.roomNumber - 1
                if(!room[roomNumber]){
                    room[roomNumber] = [user]
                }else{
                    room[roomNumber].push(user)
                }
                setRoomList(room)
            })
            const maxNumer = Math.max(...response.map(user => user.roomAssignment && user.roomAssignment.roomNumber))
            setMaxRoomNumber(maxNumer)
        })
    }

    function unassignedUserRow(user: User) {
        return (<Stack 
            direction="row"
            onMouseDown={() => setSelectedUser(user)}
            onMouseUp={() => setRoom(0)}
            onMouseEnter={() => {
                setModal(user)
            }}
            onMouseLeave={() => {
                setIsShowUserInfo(false)
            }}
            sx={{
                border: "1px solid black",
                justifyContent: 'space-between',
                backgroundColor: user.sex === 'man' ? "lightblue" : "pink",
            }}
        >
            <Box>{user.name}({user.age}) {user.attendType}</Box>
            <Box>{user.roomAssignment?.roomNumber}</Box>
        </Stack>)
    }

    function modal(){
        if(!isShowUserInfo){
            return <Stack/>
        }
        return(
        <Stack
            style={{
                position: 'absolute',
                top: mousePoint[1] + 10,
                left: mousePoint[0] + 10,
                border: '1px solid black',
                borderRadius: '12px',
                padding: '4px',
                backgroundColor: 'white',
            }}
        >
            기타 : {showUserInfo.etc} <br/>
            {userAttendInfo.length > 0 && "카풀" } {userAttendInfo.map(info => (<Stack>{["첫", "둘", "셋"][info.day]}째 날 / {info.time} / {info.inOutType}</Stack>))}
        </Stack>)
    }

    function setModal(user: User){
        setIsShowUserInfo(true)
        setShowUserInfo(user)
        
        if(userAttendInfoCache[user.id]){
            setUserAttendInfo(userAttendInfoCache[user.id])
            return
        }

        post('/admin/get-user-info', {
            userId: user.id
        }).then((data) => {
            setUserAttendInfo(data.attendInfo)
            userAttendInfoCache[user.id] = data.attendInfo
            setUserAttendInfoCache(userAttendInfoCache)
        })

    }

    function userRoomRow(user: User){
        return (<Stack
            direction="row"
            onMouseDown={() => setSelectedUser(user)}
            onMouseEnter={() => {
                setModal(user)
            }}
            onMouseLeave={() => {
                setIsShowUserInfo(false)
            }}
            width="130px"
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
        <Stack
            ml="12px"
        >
            <Stack
                direction="row"
                mb="12px"
            >
                <Stack 
                    justifyContent="center"
                >
                    {sex === 'man' ? "남자" : "여자"} 방배정 
                </Stack>
                <Button 
                    variant="contained"
                    onClick={() => setSex(sex === 'man' ?  "woman" : "man")}
                    style={{
                        margin: "6px"
                    }}
                >성별 변경</Button>
            </Stack>
            {modal()}
            <Stack mb="40px" direction="row">
                <Stack width="130px">
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