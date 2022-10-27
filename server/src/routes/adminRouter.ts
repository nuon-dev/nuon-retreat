import express from 'express'
import { hasPermission } from '../util'
import { permissionDatabase, userDatabase} from '../model/dataSource'
import { Permission, PermissionType } from '../entity/permission'

const router = express.Router()

router.get('/get-all-user-name', async (req, res) => {
    const token = req.header('token')
    if(false === await hasPermission(token, PermissionType.userList)){
        res.sendStatus(401)
        return
    }

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
    if(false === await hasPermission(token, PermissionType.permisionManage)){
        res.sendStatus(401)
        return
    }
    
    const user = await userDatabase.findOne({
        where:{
            id: data.userId,
        },
        relations:{
            permissions: true,
        }
    })
    if(user){
        res.send(user.permissions)
    }else{
        res.send([])
    }
})

router.get('/get-all-user',  async (req, res) => {
    const token = req.header('token')

    if(false === await hasPermission(token, PermissionType.userList)){
        res.sendStatus(401)
        return
    }
    
    return res.send(await userDatabase.find())
})


router.post('/set-user-permission', async (req, res) => {
    const data = req.body

    const token = req.header('token')
    if(false === await hasPermission(token, PermissionType.permisionManage)){
        res.sendStatus(401)
        return
    }

    const user = await userDatabase.findOne({
        where:{
            id: data.userId
        },
        relations:{
            permissions: true,
        }
    })

    if(!user){
        res.sendStatus(500)
        return
    }
    
    const targetPermission = user.permissions.find(permision => permision.permissionType === data.permissionType)
    if(targetPermission){
        targetPermission.have = data.have
        await permissionDatabase.save(targetPermission)
    }else{
        await permissionDatabase.save(new Permission({
            user: user,
            permissionType: data.permissionType,
            have: data.have
        }))
    }
    res.send({result: 'success'})
})

export default router