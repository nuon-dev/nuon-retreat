import { Box, Stack } from "@mui/material";
import { User } from "@entity/user";
import { useEffect, useState } from "react";
import { get, post } from "../../pages/api";


function GroupFormation (){
    const [unassignedUserList, setUnassignedUserList] = useState([] as Array<User>)
    const [groupList, setGroupList] = useState([] as Array<Array<User>>)
    const [selectedUser, setSelectedUser] = useState<User>()
    const [maxGroupNumber, setmaxGroupNumber] = useState(0)

    useEffect(() => {
        fetchData()
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
            sx={{
                border: "1px solid black",
                justifyContent: 'space-between',
                backgroundColor: user.sex === 'man' ? "lightblue" : "pink",
            }}
        >
            <Box>{user.name}({user.age})</Box>
            <Box>{user.groupAssignment.groupNumber}</Box>
        </Stack>)
    }

    function userGroupRow(user: User){
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

    function Group(groupNumber: number, userList: Array<User>){
        return (<Stack
            sx={{
                minHeight: "20px",
                border: "1px solid black"
            }}
            onMouseUp={() => setGroup(groupNumber)}
        >
            <Stack>{groupNumber}조 ({userList.length})</Stack>
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

    return (
        <Stack direction="row">
            <Stack width="200px">
                <Box>미배정({unassignedUserList.length}명)</Box>
                {unassignedUserList.map(user => unassignedUserRow(user))}
            </Stack>
            <Stack direction="row">
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