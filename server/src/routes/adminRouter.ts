import express from "express"
import { hasPermission } from "../util"
import { permissionDatabase, userDatabase } from "../model/dataSource"
import { PermissionType } from "../entity/types"
import { Permission } from "../entity/permission"

import RoomRouter from "./admin/room"
import GroupRouter from "./admin/group"
import CarRouter from "./admin/car"
import DashBoard from "./admin/dashBoard"
import Deposit from "./admin/deposit"
import EditUserData from "./admin/edit-user-data"
import { IsNull, Not } from "typeorm"

const router = express.Router()

router.get("/get-all-user-name", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.userList))) {
    res.sendStatus(401)
    return
  }

  const userList = await userDatabase.find({
    select: {
      name: true,
      id: true,
      age: true,
    },
    where: {
      name: Not(IsNull()),
    },
  })
  res.send(userList)
})

router.post("/get-user-permission-info", async (req, res) => {
  const data = req.body
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.permissionManage))) {
    res.sendStatus(401)
    return
  }

  const user = await userDatabase.findOne({
    where: {
      id: data.userId,
    },
    relations: {
      permissions: true,
    },
  })
  if (user) {
    res.send(user.permissions)
  } else {
    res.send([])
  }
})

router.get("/get-all-user", async (req, res) => {
  const token = req.header("token")

  if (false === (await hasPermission(token, PermissionType.userList))) {
    res.sendStatus(401)
    return
  }

  return res.send(
    (
      await userDatabase.find({
        relations: {
          inOutInfos: true,
        },
      })
    ).filter((user) => user.name && user.name.length > 0)
  )
})

router.post("/set-user-permission", async (req, res) => {
  const data = req.body

  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.permissionManage))) {
    res.sendStatus(401)
    return
  }

  const user = await userDatabase.findOne({
    where: {
      id: data.userId,
    },
    relations: {
      permissions: true,
    },
  })

  if (!user) {
    res.sendStatus(500)
    return
  }

  const targetPermission = user.permissions.find(
    (permission) => permission.permissionType === data.permissionType
  )
  if (targetPermission) {
    targetPermission.have = data.have
    await permissionDatabase.save(targetPermission)
  } else {
    const permission = new Permission()
    permission.have = data.have
    permission.permissionType = data.permissionType
    permission.user = user
    await permissionDatabase.save(permission)
  }
  res.send({ result: "success" })
})

router.use("/", RoomRouter)
router.use("/", GroupRouter)
router.use("/", CarRouter)
router.use("/", DashBoard)
router.use("/", Deposit)
router.use("/", EditUserData)

export default router
