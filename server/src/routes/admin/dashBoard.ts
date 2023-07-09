import express from "express";
import { hasPermission } from "../../util";
import { AttendType, PermissionType } from "../../entity/types";
import { userDatabase } from "../../model/dataSource";
import { IsNull, Not } from "typeorm";

const router = express.Router()

router.get('/get-attendee-status', async (req, res) => {

    const countOfAllUser = await userDatabase.count({where: {name: Not(IsNull())}})
    const countOfMan = await userDatabase.count({where: {sex: 'man'}})
    const countOfWoman = await userDatabase.count({where: {sex: 'woman'}})
    const countOfFullAttend = await userDatabase.count({where: {attendType: AttendType.full}})
    const countOfHalfAttend = await userDatabase.count({where: {attendType: AttendType.half}})
    const countOfGoTogether = await userDatabase.count({where: { howToGo: 'together', attendType: AttendType.full }})
    const countOfGoCar = await userDatabase.count({where: { howToGo: 'car' }})
    const countOfCompleteDeposit = await userDatabase.count({where: { deposit: true }})

    res.send({
        all: countOfAllUser,
        man: countOfMan,
        woman: countOfWoman,
        fullAttend: countOfFullAttend,
        halfAttend: countOfHalfAttend,
        goTogether: countOfGoTogether,
        goCar: countOfGoCar + countOfHalfAttend,
        completeDeposit: countOfCompleteDeposit
    })
})

router.get('/get-attendance-time', async (req, res) => {

    const allUser = await userDatabase.find({
        select:{
            createAt: true
        },
        where: {
            name: Not(IsNull())
        }
    })
    res.send(allUser.map(user => user.createAt))
})

export default router