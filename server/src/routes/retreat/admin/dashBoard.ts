import express from "express"
import { Days, Deposit, HowToMove, InOutType } from "../../../entity/types"
import {
  inOutInfoDatabase,
  retreatAttendDatabase,
  userDatabase,
} from "../../../model/dataSource"
import { IsNull, Not } from "typeorm"

const router = express.Router()

router.get("/get-attendee-status", async (req, res) => {
  const countOfAllUser = await retreatAttendDatabase.count({
    where: { isCanceled: false },
  })
  const countOfMan = await retreatAttendDatabase.count({
    where: {
      isCanceled: false,
      user: {
        gender: "man",
      },
    },
    relations: {
      user: true,
    },
  })
  const countOfWoman = await retreatAttendDatabase.count({
    where: {
      user: {
        gender: "woman",
      },
      isCanceled: false,
    },
    relations: {
      user: true,
    },
  })
  const countOfGoTogether = await retreatAttendDatabase.count({
    where: {
      howToGo: HowToMove.together,
      isCanceled: false,
    },
  })
  const countOfLeaveTogether = await retreatAttendDatabase.count({
    where: {
      howToBack: HowToMove.together,
      isCanceled: false,
    },
  })

  const countOfCompleteDeposit = await retreatAttendDatabase.count({
    where: { isDeposited: Not(Deposit.none), isCanceled: false },
  })

  res.send({
    all: countOfAllUser,
    man: countOfMan,
    woman: countOfWoman,
    goTogether: countOfGoTogether,
    leaveTogether: countOfLeaveTogether,
    completeDeposit: countOfCompleteDeposit,
  })
})

router.get("/get-attendance-time", async (req, res) => {
  const allUser = await retreatAttendDatabase.find({
    select: {
      createAt: true,
    },
    where: {
      isCanceled: false,
    },
  })
  res.send(allUser.map((user) => user.createAt))
})

router.get("/get-age-info", async (req, res) => {
  const allUser = await retreatAttendDatabase.find({
    select: {
      user: {
        yearOfBirth: true,
      },
    },
    where: {
      isCanceled: false,
    },
    relations: {
      user: true,
    },
  })
  const ageMap = {}
  allUser.map((retreatAttend) => {
    if (!ageMap[retreatAttend.user.yearOfBirth]) {
      ageMap[retreatAttend.user.yearOfBirth] = 1
      return
    }
    ageMap[retreatAttend.user.yearOfBirth] =
      ageMap[retreatAttend.user.yearOfBirth] + 1
  })
  res.send(ageMap)
})

router.get("/in-out-info", async (req, res) => {
  const infoList = await inOutInfoDatabase.find()
  res.send(infoList)
})

export default router
