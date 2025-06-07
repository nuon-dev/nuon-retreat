import express from "express"
import { worshipScheduleDatabase } from "../../model/dataSource"

const router = express.Router()

router.get("/", async (req, res) => {
  const data = await worshipScheduleDatabase.find({
    order: {
      date: "DESC",
    },
  })
  res.status(200).send(data)
})

router.post("/", async (req, res) => {
  const schedule = req.body
  await worshipScheduleDatabase.insert(schedule)
  res.status(200).send({ message: "success" })
})

router.put("/", async (req, res) => {
  const schedule = req.body
  await worshipScheduleDatabase.save(schedule)
  res.status(200).send({ message: "success" })
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params
  await worshipScheduleDatabase.delete(id)
  res.status(200).send({ message: "success" })
})

export default router
