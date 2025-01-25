import express from "express"
import {
  chatLogDatabase,
  inOutInfoDatabase,
  retreatAttendDatabase,
} from "../../model/dataSource"
import { getUserFromToken } from "../../util"
import adminRouter from "./adminRouter"
import { RetreatAttend } from "../../entity/retreatAttend"
import { HowToMove, InOutType } from "../../entity/types"

const router = express.Router()

router.get("/", async (req, res) => {
  const foundUser = await getUserFromToken(req)

  if (!foundUser) {
    res.status(401).send({ result: "fail" })
    return
  }

  var retreatAttend = await retreatAttendDatabase.findOne({
    where: {
      user: {
        id: foundUser.id,
      },
    },
    relations: {
      user: true,
    },
    select: {
      id: true,
      user: {
        id: true,
        name: true,
        phone: true,
        yearOfBirth: true,
      },
      howToGo: true,
      howToBack: true,
      isCanceled: true,
      inOutInfos: true,
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

  const retreatAttend: RetreatAttend = req.body

  if (retreatAttend.user.id !== foundUser.id) {
    res.status(401).send({ result: "fail" })
    return
  }

  await retreatAttendDatabase.save(retreatAttend)

  if (
    retreatAttend.howToGo === HowToMove.together ||
    retreatAttend.howToGo === HowToMove.driveCarAlone
  ) {
    await inOutInfoDatabase.delete({
      retreatAttend: retreatAttend,
      autoCreated: true,
      inOutType: InOutType.IN,
    })
  }

  if (
    retreatAttend.howToBack === HowToMove.together ||
    retreatAttend.howToBack === HowToMove.driveCarAlone
  ) {
    await inOutInfoDatabase.delete({
      retreatAttend: retreatAttend,
      autoCreated: true,
      inOutType: InOutType.OUT,
    })
  }

  res.send({ result: "success" })
})

router.post("/chat", async (req, res) => {
  const foundUser = await getUserFromToken(req)

  if (!foundUser) {
    res.status(401).send({ result: "fail" })
    return
  }

  const { chat, type } = req.body

  const newChat = chatLogDatabase.create({
    user: foundUser,
    content: chat,
    type: type,
  })

  await chatLogDatabase.save(newChat)

  res.send({ result: "success" })
})

router.use("/admin", adminRouter)

export default router
