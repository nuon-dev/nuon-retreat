import express from 'express'
import { hashCode, isTokenExpire } from '../util'
import {attendInfoDatabase, permissionDatabase, userDatabase} from '../model/dataSource'
import { User } from '../entity/user'
import AttendType from '../entity/attendType'
import { InOutInfo } from '../entity/inOutInfo'
import { isArray } from 'util'
import { PermissionType } from '../entity/permission'

const router = express.Router()

router.get('/get-all-user-name', async (req, res) => {
    const data = req.body

    const token = req.header('token')
    const foundUser = await userDatabase.findOneBy({token})

    if(!foundUser){
        res.send({result: 'token error'})
        return
    }

    if(isTokenExpire(foundUser.expire)){
        res.send({result: 'token expire'})
        return
    }

    const userListPermissions = await permissionDatabase.findOneBy({
        userId: foundUser.id,
        permissionTyle: PermissionType.userList,
    })

    /*
    if(!userListPermissions){
        res.send({result: `don't have permission (userListPermissions)`})
        return
    }*/

    const userList = await userDatabase.find({select: {name: true}})
    res.send(userList.map(user => user.name))
})

export default router