import express from "express"
import { hasPermission } from "../../util"
import { PermissionType } from "../../entity/types"
import { attendInfoDatabase, userDatabase } from "../../model/dataSource"

const router = express.Router()

router.get("/get-user-data", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.editUserData))) {
    res.sendStatus(401)
    return
  }

  const { userId } = req.query
  const foundUser = await userDatabase.findOne({
    where: {
      id: Number.parseInt(userId as string),
    },
  })

  if (!foundUser) {
    res.send({ result: "false" })
    return
  }
  const inoutInfoList = await attendInfoDatabase.findBy({
    user: foundUser,
  })

  res.send({
    result: "true",
    userData: foundUser,
    inoutInfoList,
  })
})

router.post("/delete-user", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.deleteUser))) {
    res.sendStatus(401)
    return
  }

  const { userId } = req.body
  const foundUser = await userDatabase.findOne({
    where: {
      id: Number.parseInt(userId as string),
    },
  })

  if (!foundUser) {
    res.send({ result: "false" })
    return
  }

  foundUser.isCancel = true
  await userDatabase.save(foundUser)
  res.send({ result: "success" })
})

export default router
