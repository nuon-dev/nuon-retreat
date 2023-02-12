import { Box, Stack } from "@mui/material";
import { User } from "@entity/user";
import { useEffect, useState } from "react";
import { get, post } from "../../pages/api";
import { InOutInfo } from "@entity/inOutInfo";
import { AttendType } from "@entity/types";


function GroupFormation (){
    const [unassignedUserList, setUnassignedUserList] = useState([] as Array<User>)
    const [groupList, setGroupList] = useState([] as Array<Array<User>>)
    const [selectedUser, setSelectedUser] = useState<User>()
    const [mousePoint, setMousePoint] = useState([0,0])
    const [maxGroupNumber, setmaxGroupNumber] = useState(0)
    const [isShowUserInfo, setIsShowUserInfo] = useState(false)
    const [showUserInfo, setShowUserInfo] = useState({} as User)
    const [userAttendInfoCache, setUserAttendInfoCache] = useState([] as Array<Array<InOutInfo>>)
    const [userAttendInfo, setUserAttendInfo] = useState([] as Array<InOutInfo>)

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
        get('/admin/get-group-formation')
        .then((response: Array<User>) => {
            const unassignedUserList = response.filter(user => user.groupAssignment.groupNumber === 0)
            setUnassignedUserList(unassignedUserList)

            const group = [] as Array<Array<User>>
            const assignedUserList = response.filter(user => user.groupAssignment.groupNumber !== 0)
            assignedUserList.map(user => {
                const groupNumber = user.groupAssignment.groupNumber - 1
                if(!group[groupNumber]){
                    group[groupNumber] = [user]
                }else{
                    group[groupNumber].push(user)
                }
                setGroupList(group)
            })
            const maxNumer = Math.max(...response.map(user => user.groupAssignment.groupNumber))
            setmaxGroupNumber(maxNumer)
        })
    }

    function unassignedUserRow(user: User) {
        return (<Stack 
            direction="row"
            onMouseDown={() => setSelectedUser(user)}
            onMouseUp={() => setGroup(0)}
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
            <Box>{user.name}({user.age}) ({user.attendType === AttendType.full ? '전' : '부'})</Box>
            <Box>{user.groupAssignment.groupNumber}</Box>
        </Stack>)
    }

    function userGroupRow(user: User){
        return (<Stack
            direction="row"
            onMouseDown={() => setSelectedUser(user)}
            width="200px"
            onMouseEnter={() => {
                setModal(user)
            }}
            onMouseLeave={() => {
                setIsShowUserInfo(false)
            }}
            sx={{
                justifyContent: 'space-between',
                backgroundColor: user.sex === 'man' ? "lightblue" : "pink",
            }}
         >
            <Box>{user.name}({user.age}) ({user.attendType === AttendType.full ? '전' : '부'})</Box>
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

    function Group(groupNumber: number, userList: Array<User>){
        return (<Stack
            sx={{
                minHeight: "20px",
                border: "1px solid black"
            }}
            onMouseUp={() => setGroup(groupNumber)}
        >
            <Stack width="160px">{groupNumber}조 ({userList.length})</Stack>
            {userList.map(user => userGroupRow(user))}
        </Stack>)
    }
    
    async function setGroup(groupNumber: number){
        if(!selectedUser){
            return
        }
        selectedUser.groupAssignment.groupNumber = groupNumber
        await post('/admin/set-group', {
            groupAssignment: selectedUser.groupAssignment,
        })
        fetchData()
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

    return (
        <Stack direction="row">
            {modal()}
            <Stack width="200px">
                <Box>미배정({unassignedUserList.length}명)</Box>
                {unassignedUserList.map(user => unassignedUserRow(user))}
            </Stack>
            <Stack 
                style={{
                    overflow: 'auto',
                    paddingRight: '80vw',
                    border: '1px solid black',
                    margin: '4px',
                    width: 'calc(100% - 200px)'
                }} 
                direction="row"
            >
                { new Array(maxGroupNumber).fill(0).map((_, index) => {
                    const group = groupList[index]
                    if(!group || group.length === 0){
                        return Group(index + 1, [])
                    }else{
                        return Group(group[0].groupAssignment.groupNumber, group)
                    }
                })
                }
                {
                    Group(maxGroupNumber + 1, [])
                }
            </Stack>
        </Stack>
    )
}

export default GroupFormation