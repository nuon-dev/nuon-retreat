import express from "express";
import { hasPermission } from "../../util";
import { AttendType, PermissionType } from "../../entity/types";
import { userDatabase } from "../../model/dataSource";

const router = express.Router()

router.get('/get-attendee-status', async (req, res) => {
    const token = req.header('token')
    if(false === await hasPermission(token, PermissionType.dashBoard)){
        res.sendStatus(401)
        return
    }

    const countOfAllUser = await userDatabase.count()
    const countOfMan = await userDatabase.count({where: {sex: 'man'}})
    const countOfWoman = await userDatabase.count({where: {sex: 'woman'}})
    const countOfFullAttend = await userDatabase.count({where: {attendType: AttendType.full}})
    const countOfHalfAttend = await userDatabase.count({where: {attendType: AttendType.half}})

    res.send({
        all: countOfAllUser,
        man: countOfMan,
        woman: countOfWoman,
        fullAttend: countOfFullAttend,
        halfAttend: countOfHalfAttend,
    })
})

router.get('/get-attendance-time', async (req, res) => {
    const token = req.header('token')
    if(false === await hasPermission(token, PermissionType.dashBoard)){
        res.sendStatus(401)
        return
    }

    const allUser = await userDatabase.find({
        select:{
            createAt: true
        }
    })
    res.send(allUser.map(user => user.createAt))
})

export default router