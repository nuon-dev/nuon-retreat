import express, { Router } from "express"

import authRouter from "./authRouter"
import infoRouter from "./infoRouter"
import adminRouter from "./adminRouter"
import statusRouter from "./statusRouter"
import cors from "cors"
import { joyfulJourneyManageDatabase, userDatabase } from "../model/dataSource"

const router: Router = express.Router()

router.use(cors())
router.use("/auth", authRouter)
router.use("/info", infoRouter)
router.use("/admin", adminRouter)
router.use("/status", statusRouter)

router.get("/joyful-journey-manage", async (req, res) => {
  const token = req.header("token")

  const foundUser = await userDatabase.findOne({
    where: {
      token,
    },
  })

  if (!foundUser) {
    res.sendStatus(401)
    return
  }

  const result = await joyfulJourneyManageDatabase.findOne({
    where: {
      user: { id: foundUser.id },
    },
  })
  if (result) {
    res.send(result)
  } else {
    res.send({})
  }
})

router.get("/joyful-journey-manage-full", async (req, res) => {
  const result = await joyfulJourneyManageDatabase.find({
    select: {
      user: {
        name: true,
        darak: true,
        village: true,
      },
    },
    relations: { user: true },
  })
  res.send(result)
})

router.post("/joyful-journey-manage", async (req, res) => {
  const token = req.header("token")

  const foundUser = await userDatabase.findOne({
    where: {
      token,
    },
  })

  if (!foundUser) {
    res.sendStatus(401)
    return
  }

  const { lookForwardTo, itForSure } = req.body
  const foundData = await joyfulJourneyManageDatabase.findOne({
    where: {
      user: {
        id: foundUser.id,
      },
    },
  })

  if (foundData) {
    await joyfulJourneyManageDatabase.update(
      {
        user: foundUser,
      },
      {
        lookForwardTo,
        itForSure,
      }
    )
  } else {
    const data = joyfulJourneyManageDatabase.create({
      user: foundUser,
      lookForwardTo,
      itForSure,
    })
    await joyfulJourneyManageDatabase.save(data)
  }
  res.send({ result: "success" })
  return
})

export default router
