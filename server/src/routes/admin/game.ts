import express from "express"
import { hasPermission } from "../../util"
import { PermissionType } from "../../entity/types"
import { game1Database } from "../../model/dataSource"

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

export default router
