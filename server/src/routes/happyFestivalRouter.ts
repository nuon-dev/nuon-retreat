import { Router } from "express"
import { happyFestivalScoreDatabase } from "../model/dataSource"
import { HappyFestivalScore } from "../entity/happyFestivalScore"

const router = Router()

router.post("/save-score", async (req, res) => {
  const happyFestivalScore = req.body as HappyFestivalScore

  if (happyFestivalScore.id) {
    await happyFestivalScoreDatabase.save(happyFestivalScore)
  }

  const scoreObject = happyFestivalScoreDatabase.create(happyFestivalScore)
  await happyFestivalScoreDatabase.save(scoreObject)

  res.send({ result: "ok" })
})

router.get("/score-list", async (req, res) => {
  const scoreList = await happyFestivalScoreDatabase.find()
  res.send(scoreList)
})

export default router
