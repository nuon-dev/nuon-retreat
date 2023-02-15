import express from 'express'
import { PermissionType, AttendType } from "../../entity/types"
import { attendInfoDatabase, userDatabase } from "../../model/dataSource"
import { hasPermission } from "../../util"

const router = express.Router()

router.get('/get-car-info', async (req, res) => {
    const token = req.header('token')
    if(false ===  await hasPermission(token, PermissionType.carpooling)){
        res.sendStatus(401)
        return
    }

    const infoList = await attendInfoDatabase.find({
        select:{
            inOutType: true,
            id: true,
            time: true,
            howToMove: true,
            userInTheCar: true,
            day: true,
            position: true,
        },
        relations:{
            user: true,
            rideCarInfo: true,
            userInTheCar: {
                user: true
            },
        }
    })
    res.send(infoList)
})

router.post('/set-car', async (req, res) => {
    const token = req.header('token')
    if(false ===  await hasPermission(token, PermissionType.carpooling)){
        res.sendStatus(401)
        return
    }

    const data = req.body
    const inOutInfo = data.inOutInfo

    await attendInfoDatabase.save(inOutInfo)
    res.send({result: "success"})
    return
})

export default router