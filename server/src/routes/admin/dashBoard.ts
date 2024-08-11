import express from "express"
import { HowToMove, InOutType } from "../../entity/types"
import { attendInfoDatabase, userDatabase } from "../../model/dataSource"
import { IsNull, Not } from "typeorm"

const router = express.Router()

router.get("/get-attendee-status", async (req, res) => {
  const countOfAllUser = await userDatabase.count({
    where: { name: Not(IsNull()), isCancel: false },
  })
  const countOfMan = await userDatabase.count({
    where: { sex: "man", name: Not(IsNull()), isCancel: false },
  })
  const countOfWoman = await userDatabase.count({
    where: { sex: "woman", name: Not(IsNull()), isCancel: false },
  })
  const countOfGoTogether = await userDatabase.count({
    where: {
      howToGo: HowToMove.together,
      name: Not(IsNull()),
      isCancel: false,
    },
  })
  const countOfLeaveTogether = await userDatabase.count({
    where: {
      howToLeave: HowToMove.together,
      name: Not(IsNull()),
      isCancel: false,
    },
  })

  const countOfCompleteDeposit = await userDatabase.count({
    where: { deposit: true, name: Not(IsNull()), isCancel: false },
  })

  const countOfIsOutAtThursday = await userDatabase.count({
    where: { isOutAtThursday: "true", name: Not(IsNull()), isCancel: false },
  })

  const allUser = await userDatabase.find()
  const allInfo = await attendInfoDatabase.find({ relations: { user: true } })
  const busUserList = allUser
    .filter((user) => user.howToGo === HowToMove.together)
    .map((u) => u.id)
  const aloneAttend = allInfo
    .filter(
      (info) =>
        info.day === 0 && info.time < 14 && info.inOutType === InOutType.IN
    )
    .map((info) => info.user.id)

  const firstAttendUser = [...busUserList, ...aloneAttend]
  const lastAttendUser = allInfo
    .filter(
      (info) =>
        !(info.day === 0 && info.time < 14 && info.inOutType === InOutType.IN)
    )
    .map((info) => info.user.id)

  const attendUser = allUser.filter((user) =>
    firstAttendUser.find((id) => id === user.id)
  )

  const allAttendUserNumber = attendUser.filter(
    (user) => !lastAttendUser.find((id) => id === user.id)
  ).length

  res.send({
    all: countOfAllUser,
    man: countOfMan,
    woman: countOfWoman,
    goTogether: countOfGoTogether,
    leaveTogether: countOfLeaveTogether,
    completeDeposit: countOfCompleteDeposit,
    countOfIsOutAtThursday,
    allAttendUserNumber,
  })
})

router.get("/get-attendance-time", async (req, res) => {
  const allUser = await userDatabase.find({
    select: {
      createAt: true,
    },
    where: {
      name: Not(IsNull()),
      isCancel: false,
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
      isCancel: false,
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

router.get("/in-out-info", async (req, res) => {
  const infoList = await attendInfoDatabase.find()
  res.send(infoList)
})

export default router
