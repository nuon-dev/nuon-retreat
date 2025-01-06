import express from "express"
import { hasPermission } from "../../util"
import { PermissionType } from "../../entity/types"
import { attendInfoDatabase, userDatabase } from "../../model/dataSource"

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

export default router
