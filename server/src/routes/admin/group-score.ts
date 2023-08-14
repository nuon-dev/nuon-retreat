import express from "express"
import { hasPermission } from "../../util"
import { PermissionType } from "../../entity/types"
import {
  groupScoreDataDatabase,
  groupScoreDatabase,
} from "../../model/dataSource"
import { Group, GroupScoreData } from "../../entity/groupScore"

const router = express.Router()

router.post("/edit-group-score", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.editGroupScore))) {
    res.sendStatus(401)
    return
  }

  const body = req.body
  const gameNumber = body.gameNumber
  const score = body.gameScore

  const groupList = await groupScoreDatabase.find({
    relations: {
      groupScore: true,
    },
  })
  groupList.forEach(async (group, index) => {
    const groupScoreData = group.groupScore.find(
      (scoreData) => scoreData.gameNumber === gameNumber
    )
    if (groupScoreData) {
      groupScoreData.score = score[index]
      console.log(groupScoreData)
      await groupScoreDataDatabase.save(groupScoreData)
    } else {
      const groupScoreData = new GroupScoreData()
      groupScoreData.score = score[index]
      groupScoreData.gameNumber = gameNumber
      await groupScoreDataDatabase.save(groupScoreData)
      group.groupScore[gameNumber] = groupScoreData
    }
    await groupScoreDatabase.save(group)
  })

  res.send({ result: "success" })
})

router.post("/inert-group-name", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.editGroupScore))) {
    res.sendStatus(401)
    return
  }

  const body = req.body
  const groupName = body.groupName

  const group = new Group()
  group.groupName = groupName
  group.groupScore = []
  await groupScoreDatabase.save(group)
  res.send({ result: "success" })
})

router.get("/group-list", async (req, res) => {
  const body = req.body
  const gameNumber = body.gameNumber

  const scoreData = await groupScoreDatabase.find({
    relations: {
      groupScore: true,
    },
  })

  res.send({
    scoreData,
  })
})

export default router
