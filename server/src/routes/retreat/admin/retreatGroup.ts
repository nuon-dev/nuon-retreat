import express from "express"
import { PermissionType } from "../../../entity/types"
import {
  groupAssignmentDatabase,
  userDatabase,
} from "../../../model/dataSource"
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

  const userList = await userDatabase.find({
    select: {
      id: true,
      name: true,
      age: true,
      sex: true,
      etc: true,
      inOutInfos: true,
    },
    relations: {
      groupAssignment: true,
      inOutInfos: true,
    },
    where: {
      name: Not(IsNull()),
      isCancel: false,
    },
  })

  res.send(userList.filter((user) => user.name && user.name.length > 0))
})

router.post("/set-retreat-group", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.groupManage))) {
    res.sendStatus(401)
    return
  }

  const data = req.body
  const groupAssignment = data.groupAssignment

  await groupAssignmentDatabase.save(groupAssignment)
  res.send({ result: "success" })
  return
})

export default router
