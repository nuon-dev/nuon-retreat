import express from 'express'
import { PermissionType } from "../../entity/types"
import { attendInfoDatabase, roomAssignmentDatabase, userDatabase } from "../../model/dataSource"
import { hasPermission } from "../../util"
import { IsNull, Not } from 'typeorm'

const router = express.Router()

router.get('/get-room-assignment', async (req, res) => {
    const token = req.header('token')
    if(false ===  await hasPermission(token, PermissionType.showRoomAssignment)){
        res.sendStatus(401)
        return
    }

    const userList = await userDatabase.find({
        select: {
            id: true,
            name: true,
            age: true,
            sex: true,
            etc: true,
            attendType: true,
            inOutInfos: true
        },
        relations: {
            roomAssignment: true,
            inOutInfos: true
        },
        where: {
            name: Not(IsNull())
        }
    })

    res.send(userList)
})

router.post('/get-user-info', async (req, res) => {
    const data = req.body
    const userId = data.userId

    const foundUser = await userDatabase.findOneBy({
        id: userId,
    })

    const attendInfo = await attendInfoDatabase.find({
        where:{
            user: foundUser
        }
    })

    res.send({
        user: foundUser,
        attendInfo,
    })
    return
})

router.post('/set-room', async (req, res) => {
    const token = req.header('token')
    if(false ===  await hasPermission(token, PermissionType.roomManage)){
        res.sendStatus(401)
        return
    }

    const data = req.body
    const roomAssignment = data.roomAssignment

    await roomAssignmentDatabase.save(roomAssignment)
    res.send({result: "success"})
    return
})

export default router