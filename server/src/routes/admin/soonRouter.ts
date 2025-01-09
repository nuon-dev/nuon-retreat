import express from "express"
import { hasPermission } from "../../util"
import { PermissionType } from "../../entity/types"
import { userDatabase } from "../../model/dataSource"

const router = express.Router()

router.get("/get-all-user", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.userList))) {
    res.sendStatus(401)
    return
  }

  const foundUser = await userDatabase.find()

  res.send(foundUser)
})

router.post("/insert-user", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.editUserData))) {
    res.sendStatus(401)
    return
  }

  const user = req.body
  await userDatabase.insert(user)

  res.status(200).send({ message: "success" })
})

router.put("/update-user", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.editUserData))) {
    res.sendStatus(401)
    return
  }

  const user = req.body
  await userDatabase.save(user)

  res.status(200).send({ message: "success" })
})
export default router
