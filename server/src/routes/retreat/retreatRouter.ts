import express from "express"
import { retreatAttendDatabase } from "../../model/dataSource"
import { getUserFromToken } from "../../util"
import adminRouter from "./adminRouter"

const router = express.Router()

router.get("/", async (req, res) => {
  const foundUser = await getUserFromToken(req)

  if (!foundUser) {
    res.status(401).send({ result: "fail" })
    return
  }

  var retreatAttend = await retreatAttendDatabase.findOne({
    where: {},
    relations: {
      inOutInfos: true,
      user: true,
    },
  })

  if (!retreatAttend) {
    retreatAttend = retreatAttendDatabase.create({
      user: foundUser,
    })
    await retreatAttendDatabase.save(retreatAttend)
  }

  res.json(retreatAttend)
})

router.post("/edit-information", async (req, res) => {
  const foundUser = await getUserFromToken(req)

  if (!foundUser) {
    res.status(401).send({ result: "fail" })
    return
  }

  const retreatAttend = req.body

  if (retreatAttend.user.id !== foundUser.id) {
    res.status(401).send({ result: "fail" })
    return
  }

  await retreatAttendDatabase.save(retreatAttend)
  res.send({ result: "success" })
})

router.use("/admin", adminRouter)

export default router
