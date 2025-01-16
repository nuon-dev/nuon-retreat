import express from "express"
import { retreatAttendDatabase } from "../../model/dataSource"
import { getUserFromToken } from "../../util"

const router = express.Router()

router.get("/", async (req, res) => {
  const foundUser = await getUserFromToken(req)

  if (!foundUser) {
    res.status(401).send({ result: "fail" })
    return
  }

  const retreatAttend = await retreatAttendDatabase.findOne({
    where: {},
    relations: {
      inOutInfo: true,
      user: true,
    },
  })

  res.json(retreatAttend)
})

export default router
