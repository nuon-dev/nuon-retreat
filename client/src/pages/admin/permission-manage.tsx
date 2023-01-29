import { ChangeEvent, useEffect, useState } from "react"
import { get, post } from "../../pages/api";
import { User } from '@entity/user'
import { FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Stack } from "@mui/material";

enum PermissionType{
    superUser,
    admin,
    userList,
    resetPassword,
    carpooling,
    permisionManage,
    showRoomAssignment,
    roomManage,
    showGroupAssignment,
    groupManage,
    dashBoard,
    deposit,
}


function PermissionManage () {
    const [userList, setUserList] = useState([] as Array<User>)
    const [selectedUserId, setSelectedUserId] = useState(0)
    const [userPermission, setUserPermission] = useState<{[key: number]: boolean}>({})

    useEffect(() => {
        get('/admin/get-all-user-name')
        .then(respone => {
            setUserList(respone)
            if(respone.length > 0){
                setSelectedUserId(respone[0].id)
            }
        })
    }, [])

    useEffect(() => {
        loadUserPermission()
    }, [selectedUserId])

    

    function onClickUser (event: SelectChangeEvent<number>) {
        setSelectedUserId(Number(event.target.value))
    }

    const permissionKrString = {
        [PermissionType.admin]: '준비팀',
        [PermissionType.carpooling]: '카풀',
        [PermissionType.permisionManage]: '권환 관리',
        [PermissionType.resetPassword]: '비밀번호 초기화',
        [PermissionType.userList]: '사용자 목록',
        [PermissionType.showRoomAssignment]: '방배정 조회',
        [PermissionType.showGroupAssignment]: '조편성 조회',
        [PermissionType.roomManage]: '방배정',
        [PermissionType.groupManage]: '조편성',
        [PermissionType.deposit]: '입금 처리',
    }

    function loadUserPermission(){
        post('/admin/get-user-permision-info', {userId: selectedUserId})
        .then(respone => {
            const data:{[key: number]: boolean}  = {}
            respone.map((permission: {
                permissionType: number
                have: boolean
            }) => data[permission.permissionType] = permission.have)
            setUserPermission(data)
        })
    }

    function onChangePermission(event: ChangeEvent<HTMLInputElement>, key: number) {
        post('/admin/set-user-permission', {
            userId: selectedUserId,
            have: event.target.value === "true",
            permissionType: key,
        }).then(respone => {
            console.log(respone)
            loadUserPermission()
        })
    }

    return (
        <Stack>
            관리 할 사람 선택
            <Select 
                value={selectedUserId}
                onChange={onClickUser}
            >
                {userList.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
            </Select>        

            {Object.entries(permissionKrString).map(([key, krName]) => (
                <RadioGroup
                    value={!!userPermission[Number(key)]}
                    onChange={e => onChangePermission(e, Number(key))}
                >
                     <FormLabel>{krName}</FormLabel>
                    <FormControlLabel value={true} control={<Radio/>} label="있음"/>
                    <FormControlLabel value={false} control={<Radio/>} label="없음"/>
                </RadioGroup>
            ))}
        </Stack>
    )
}

export default PermissionManage