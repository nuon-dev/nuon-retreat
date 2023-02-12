import express from 'express'
import { PermissionType } from "../../entity/types"
import { groupAssignmentDatabase, roomAssignmentDatabase, userDatabase } from "../../model/dataSource"
import { hasPermission } from "../../util"

const router = express.Router()

router.get('/get-group-formation', async (req, res) => {
    const token = req.header('token')
    if(false ===  await hasPermission(token, PermissionType.showGroupAssignment)){
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
        },
        relations: {
            groupAssignment: true,
        }
    })

    res.send(userList)
})

router.post('/set-group', async (req, res) => {
    const token = req.header('token')
    if(false ===  await hasPermission(token, PermissionType.groupManage)){
        res.sendStatus(401)
        return
    }

    const data = req.body
    const groupAssignment = data.groupAssignment

    await groupAssignmentDatabase.save(groupAssignment)
    res.send({result: "success"})
    return
})

export default router