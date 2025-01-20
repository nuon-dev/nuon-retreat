import express from "express"
import { inOutInfoDatabase } from "../../model/dataSource"
import { getUserFromToken } from "../../util"

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
  const inOutInfo = req.body

  await inOutInfoDatabase.save(inOutInfo)
  res.send({ result: "success" })
})

export default router
