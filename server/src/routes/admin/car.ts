import express from 'express'
import AttendType from '../../entity/attendType'
import { PermissionType } from "../../entity/permission"
import { roomAssignmentDatabase, userDatabase } from "../../model/dataSource"
import { hasPermission } from "../../util"

const router = express.Router()

router.get('/get-car-info', async (req, res) => {
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
        },
        where:{
            attendType: AttendType.half,
        },
        relations: {
            roomAssignment: true,
        }
    })

    res.send(userList)
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