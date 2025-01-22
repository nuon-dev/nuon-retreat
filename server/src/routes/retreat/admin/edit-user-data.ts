import express from "express"
import { hasPermission } from "../../../../src/util"
import { PermissionType } from "../../../entity/types"
import { retreatAttendDatabase } from "../../../model/dataSource"

const router = express.Router()

router.get("/get-user-data", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.editUserData))) {
    res.sendStatus(401)
    return
  }

  const { userId } = req.query
  const foundUser = await retreatAttendDatabase.findOne({
    where: {
      id: Number.parseInt(userId as string),
    },
    relations: {
      user: true,
      inOutInfos: true,
    },
  })

  if (!foundUser) {
    res.send({ result: "false" })
    return
  }

  res.send({
    result: "true",
    userData: foundUser,
  })
})

router.post("/delete-user", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.deleteUser))) {
    res.sendStatus(401)
    return
  }

  const { userId } = req.body
  const foundRetreatAttend = await retreatAttendDatabase.findOne({
    where: {
      id: Number.parseInt(userId as string),
    },
  })

  if (!foundRetreatAttend) {
    res.send({ result: "false" })
    return
  }

  foundRetreatAttend.isCanceled = true
  await retreatAttendDatabase.save(foundRetreatAttend)
  res.send({ result: "success" })
})

export default router
