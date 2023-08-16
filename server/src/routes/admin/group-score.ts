import express from "express"
import { hasPermission } from "../../util"
import { PermissionType } from "../../entity/types"
import {
  teamScoreDataDatabase,
  teamScoreDatabase,
} from "../../model/dataSource"
import { Team, TeamScoreData } from "../../entity/teamScore"

const router = express.Router()

router.post("/edit-team-score", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.editTeamScore))) {
    res.sendStatus(401)
    return
  }

  const body = req.body
  const gameNumber = body.gameNumber
  const score = body.gameScore

  const teamList = await teamScoreDatabase.find({
    relations: {
      teamScore: true,
    },
  })
  teamList.forEach(async (team, index) => {
    const teamScoreData = team.teamScore.find(
      (scoreData) => scoreData.gameNumber === gameNumber
    )
    if (teamScoreData) {
      teamScoreData.score = score[index]
      await teamScoreDataDatabase.save(teamScoreData)
    } else {
      const teamScoreData = new TeamScoreData()
      teamScoreData.score = score[index]
      teamScoreData.gameNumber = gameNumber
      await teamScoreDataDatabase.save(teamScoreData)
      team.teamScore[gameNumber] = teamScoreData
    }
    await teamScoreDatabase.save(team)
  })

  res.send({ result: "success" })
})

router.post("/inert-team-name", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.editTeamScore))) {
    res.sendStatus(401)
    return
  }

  const body = req.body
  const teamName = body.teamName

  const team = new Team()
  team.teamName = teamName
  team.teamScore = []
  await teamScoreDatabase.save(team)
  res.send({ result: "success" })
})

router.get("/team-list", async (req, res) => {
  const body = req.body
  const gameNumber = body.gameNumber

  const scoreData = await teamScoreDatabase.find({
    relations: {
      teamScore: true,
    },
  })

  res.send({
    scoreData,
  })
})

export default router
