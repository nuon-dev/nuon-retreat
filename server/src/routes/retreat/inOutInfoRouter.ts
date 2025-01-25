import express from "express"
import {
  inOutInfoDatabase,
  retreatAttendDatabase,
} from "../../model/dataSource"
import { getUserFromToken } from "../../util"
import { InOutInfo } from "../../entity/inOutInfo"

const router = express.Router()

router.get("/", async (req, res) => {
  const foundUser = await getUserFromToken(req)

  if (!foundUser) {
    res.status(401).send({ result: "fail" })
    return
  }

  const inOutInfo = await inOutInfoDatabase.find({
    where: {
      retreatAttend: {
        user: {
          id: foundUser.id,
        },
      },
    },
  })

  res.send(inOutInfo)
})

router.post("/edit-information", async (req, res) => {
  const foundUser = await getUserFromToken(req)
  const inOutInfo = req.body as InOutInfo

  const foundRetreatAttend = await retreatAttendDatabase.findOne({
    where: {
      user: {
        id: foundUser.id,
      },
    },
  })

  if (inOutInfo.id) {
    await inOutInfoDatabase.save(inOutInfo)
  } else {
    const createdInOuInfo = inOutInfoDatabase.create(inOutInfo)
    createdInOuInfo.retreatAttend = foundRetreatAttend
    await inOutInfoDatabase.save(createdInOuInfo)
  }
  res.send({ result: "success" })
})

router.post("/delete-attend-time", async (req, res) => {
  const inOutInfo = req.body

  await inOutInfoDatabase.remove(inOutInfo)
  res.send({ result: "success" })
})

export default router
