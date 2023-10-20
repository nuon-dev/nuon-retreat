import { Router } from "express"
import { ANewLaity, status } from "../entity/aNewLaity"
import { aNewLaityDatabase, userDatabase } from "../model/dataSource"

const router = Router()

router.post("/save", async (req, res) => {
  const data = req.body as ANewLaity

  if (!data.id) {
    const newData = aNewLaityDatabase.create(data)
    await aNewLaityDatabase.save(newData)
    res.send({ result: "ok" })
    return
  }

  await aNewLaityDatabase.save(data)
  res.send({ result: "ok" })
})

router.get("/my-list", async (req, res) => {
  const token = req.header("token")

  const foundUser = await userDatabase.findOne({
    where: {
      token,
    },
    relations: {
      roomAssignment: true,
      groupAssignment: true,
    },
  })

  if (!foundUser) {
    res.send({ error: "사용자 정보 없음" })
    return
  }

  const result = await aNewLaityDatabase.find({
    where: {
      user: {
        id: foundUser.id,
      },
    },
  })

  res.send(result)
})

router.post("/delete", async (req, res) => {
  const newLaity = req.body as ANewLaity

  if (!newLaity.id) {
    res.send({ error: "정보 없음" })
    return
  }

  await aNewLaityDatabase.delete(newLaity)
  res.send({ result: "ok" })
})

router.get("/dashboard", async (req, res) => {
  const allList = await aNewLaityDatabase.find({
    relations: {
      user: true,
    },
  })

  const allCount = allList.length
  const worryCount = allList.filter(
    (each) => each.status === status.worry
  ).length
  const confirmCount = allList.filter(
    (each) => each.status === status.confirm
  ).length
  const cancelCount = allList.filter(
    (each) => each.status === status.cancel
  ).length

  res.send({ allCount, worryCount, confirmCount, allList, cancelCount })
})

export default router
