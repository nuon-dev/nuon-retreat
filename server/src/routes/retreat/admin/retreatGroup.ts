import express from "express"
import { PermissionType } from "../../../entity/types"
import { retreatAttendDatabase, userDatabase } from "../../../model/dataSource"
import { hasPermission } from "../../../util"
import { IsNull, Not } from "typeorm"

const router = express.Router()

router.get("/get-retreat-group-formation", async (req, res) => {
  const token = req.header("token")
  if (
    false === (await hasPermission(token, PermissionType.showGroupAssignment))
  ) {
    res.sendStatus(401)
    return
  }

  const userList = await retreatAttendDatabase.find({
    select: {
      id: true,
      etc: true,
      inOutInfos: true,
    },
    relations: {
      inOutInfos: true,
    },
    where: {
      isCanceled: false,
    },
  })

  res.send(userList)
})

router.post("/set-retreat-group", async (req, res) => {
  const token = req.header("token")
  if (
    false === (await hasPermission(token, PermissionType.showGroupAssignment))
  ) {
    res.sendStatus(401)
    return
  }

  const data = req.body
  const selectedUser = data.selectedUser

  await retreatAttendDatabase.save(selectedUser)
  res.send({ result: "success" })
  return
})

export default router
