import express from "express"
import { AttendType, HowToGo } from "../../entity/types"
import { userDatabase } from "../../model/dataSource"
import { IsNull, Not } from "typeorm"

const router = express.Router()

router.get("/get-attendee-status", async (req, res) => {
  const countOfAllUser = await userDatabase.count({
    where: { name: Not(IsNull()) },
  })
  const countOfMan = await userDatabase.count({
    where: { sex: "man", name: Not(IsNull()) },
  })
  const countOfWoman = await userDatabase.count({
    where: { sex: "woman", name: Not(IsNull()) },
  })
  const countOfFullAttend = await userDatabase.count({
    where: { attendType: AttendType.full, name: Not(IsNull()) },
  })
  const countOfHalfAttend = await userDatabase.count({
    where: { attendType: AttendType.half, name: Not(IsNull()) },
  })
  const countOfGoTogether = await userDatabase.count({
    where: {
      howToGo: HowToGo.together,
      attendType: AttendType.full,
      name: Not(IsNull()),
    },
  })
  const countOfGoCar = await userDatabase.count({
    where: { howToGo: HowToGo.car, name: Not(IsNull()) },
  })
  const countOfCompleteDeposit = await userDatabase.count({
    where: { deposit: true, name: Not(IsNull()) },
  })

  res.send({
    all: countOfAllUser,
    man: countOfMan,
    woman: countOfWoman,
    fullAttend: countOfFullAttend,
    halfAttend: countOfHalfAttend,
    goTogether: countOfGoTogether,
    goCar: countOfGoCar + countOfHalfAttend,
    completeDeposit: countOfCompleteDeposit,
  })
})

router.get("/get-attendance-time", async (req, res) => {
  const allUser = await userDatabase.find({
    select: {
      createAt: true,
    },
    where: {
      name: Not(IsNull()),
    },
  })
  res.send(allUser.map((user) => user.createAt))
})

router.get("/get-age-info", async (req, res) => {
  const allUser = await userDatabase.find({
    select: {
      age: true,
    },
    where: {
      name: Not(IsNull()),
    },
  })
  const ageMap = {}
  allUser.map((user) => {
    if (!ageMap[user.age]) {
      ageMap[user.age] = 1
      return
    }
    ageMap[user.age] = ageMap[user.age] + 1
  })
  res.send(ageMap)
})

export default router
