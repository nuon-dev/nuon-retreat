import express from 'express'
import { isTokenExpire } from '../util'
import { permissionDatabase, userDatabase} from '../model/dataSource'
import { Permission, PermissionType } from '../entity/permission'

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
        permissionType: PermissionType.userList,
    })

    /*
    if(!userListPermissions){
        res.send({result: `don't have permission (userList)`})
        return
    }*/

    const userList = await userDatabase.find({
        select: {
            name: true,
             id: true
        }})
    res.send(userList)
})

router.post('/get-user-permision-info',async (req, res) => {
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
        permissionType: PermissionType.permisionManage,
    })

    /*
    if(!userListPermissions){
        res.send({result: `don't have permission (permisionManage)`})
        return
    }*/

    console.log(data.userId)
    const permissionList = await permissionDatabase.findBy({})
    res.send(permissionList)
})

router.get('/get-all-user',  async (req, res) => {

    const token = req.header('token')
    const foundUser = await userDatabase.findOne({
        where:{
            token,
        },
        relations: {
            permissions: true,
        }
    })

    if(!foundUser){
        res.send({result: 'token error'})
        return
    }

    if(isTokenExpire(foundUser.expire)){
        res.send({result: 'token expire'})
        return
    }

    const UserListPermission = foundUser.permissions.find(permission => permission.permissionType === PermissionType.userList)
    if(UserListPermission && UserListPermission.have){
        return res.send(await userDatabase.find())
    }else{
        return res.send({result: `don't have permission (userList)`})
    }
})

router.post('/set-user-permission', async (req, res) => {
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
        permissionType: PermissionType.permisionManage,
    })

    /*
    if(!userListPermissions){
        res.send({result: `don't have permission (permisionManage)`})
        return
    }*/

    const selectedUserPermission = await permissionDatabase.findOneBy({
        permissionType: data.permissionType
    })
    if(selectedUserPermission){
        selectedUserPermission.have = data.have
        await permissionDatabase.save(selectedUserPermission)
        res.send({result: 'success'})
        return
    }
    const permision = new Permission()
    permision.have = data.have
    permision.permissionType = data.permissionType
    await permissionDatabase.save(permision)
    res.send({result: 'success'})
})

export default router