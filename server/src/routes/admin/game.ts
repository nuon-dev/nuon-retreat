import express from "express"
import { hasPermission } from "../../util"
import { PermissionType } from "../../entity/types"
import { game1Database, game2Database } from "../../model/dataSource"
import { Game2 } from "../../entity/game2"

const router = express.Router()

router.post("/game1/set-seat", async (req, res) => {
  const token = req.header("token")

  if (false === (await hasPermission(token, PermissionType.game1))) {
    res.sendStatus(401)
    return
  }

  const { seatClass, position } = req.body as any
  const foundPosition = await game1Database.findOneBy({
    seatClass,
    position,
  })
  if (foundPosition) {
    res.send({
      result: "fail",
    })
    return
  }

  const newSeat = game1Database.create(req.body)
  await game1Database.save(newSeat)
  res.send({
    result: "success",
  })
  return
})

router.get("/game1/my-seat", async (req, res) => {
  const token = req.header("token")

  if (false === (await hasPermission(token, PermissionType.game1))) {
    res.sendStatus(401)
    return
  }

  const { user } = req.query as any
  const mySeats = await game1Database.findBy({ user })
  res.send(mySeats)
})

router.get("/game1/all-seat", async (req, res) => {
  const token = req.header("token")

  if (false === (await hasPermission(token, PermissionType.game1))) {
    res.sendStatus(401)
    return
  }

  const mySeats = await game1Database.find()
  res.send(mySeats)
})

router.post("/game1/delete", async (req, res) => {
  const token = req.header("token")

  if (false === (await hasPermission(token, PermissionType.game1))) {
    res.sendStatus(401)
    return
  }

  const { seatClass, position } = req.body as any
  const foundPosition = await game1Database.findOneBy({
    seatClass,
    position,
  })
  if (foundPosition) {
    await game1Database.delete(foundPosition)
  }

  res.send({ result: "success" })
})

router.get("/game1/check-permission", async (req, res) => {
  const token = req.header("token")

  if (false === (await hasPermission(token, PermissionType.game1))) {
    res.sendStatus(401)
    return
  }
  res.send({ result: "success" })
})

/////////////

router.get("/game2/check-permission", async (req, res) => {
  const token = req.header("token")

  if (false === (await hasPermission(token, PermissionType.game2))) {
    res.sendStatus(401)
    return
  }
  res.send({ result: "success" })
})

router.post("/game2/set-position", async (req, res) => {
  const token = req.header("token")

  if (false === (await hasPermission(token, PermissionType.game2))) {
    res.sendStatus(401)
    return
  }

  const body = req.body as Game2

  const foundTeamData = await game2Database.findOneBy({
    teamNumber: body.teamNumber,
  })
  if (foundTeamData) {
    body.id = foundTeamData.id
    body.moveCount = body.moveCount + foundTeamData.moveCount
  } else {
    body.id = null
  }
  await game2Database.save(body)
  res.send({ result: "success" })
})

router.get("/game2/my-position", async (req, res) => {
  const token = req.header("token")

  if (false === (await hasPermission(token, PermissionType.game2))) {
    res.sendStatus(401)
    return
  }

  const query = req.query
  const { teamNumber } = query

  const foundPosition = await game2Database.findOneBy({
    teamNumber: teamNumber as any,
  })

  res.send(foundPosition)
})

router.get("/game2/all-position", async (req, res) => {
  const token = req.header("token")

  if (false === (await hasPermission(token, PermissionType.game2))) {
    res.sendStatus(401)
    return
  }

  const foundPosition = await game2Database.find()
  res.send(foundPosition)
})

router.post("/game2/reset", async (req, res) => {
  const token = req.header("token")

  if (false === (await hasPermission(token, PermissionType.game2))) {
    res.sendStatus(401)
    return
  }

  await game2Database.delete({})
  res.send({ result: "success" })
})

export default router
