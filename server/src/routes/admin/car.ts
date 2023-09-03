import express from "express"
import { PermissionType } from "../../entity/types"
import { attendInfoDatabase, userDatabase } from "../../model/dataSource"
import { hasPermission } from "../../util"
import { InOutInfo } from "../../entity/inOutInfo"
import { IsNull, Not } from "typeorm"

const router = express.Router()

router.get("/get-car-info", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.carpooling))) {
    res.sendStatus(401)
    return
  }

  const infoList = await attendInfoDatabase.find({
    select: {
      inOutType: true,
      id: true,
      time: true,
      howToMove: true,
      userInTheCar: true,
      day: true,
      position: true,
    },
    relations: {
      user: true,
      rideCarInfo: true,
      userInTheCar: {
        user: true,
      },
    },
    where: {
      user: {
        name: Not(IsNull()),
      },
    },
  })
  res.send(infoList)
})

router.post("/set-car", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.carpooling))) {
    res.sendStatus(401)
    return
  }

  const data = req.body
  const inOutInfo = data.inOutInfo as InOutInfo

  if (inOutInfo.day === undefined || inOutInfo.day === null) {
    res.send({})
    return
  }

  await attendInfoDatabase.save(inOutInfo)
  res.send({ result: "success" })
  return
})

export default router
