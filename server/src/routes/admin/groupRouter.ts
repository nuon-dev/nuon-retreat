import express from "express"
import { groupDatabase } from "../../model/dataSource"

const router = express.Router()

router.get("/", async (req, res) => {
  const groupList = await groupDatabase.find()
  res.send(groupList)
})

router.post("/", async (req, res) => {
  const group = req.body
  await groupDatabase.insert(group)
  res.send({ result: "success" })
})

router.put("/", async (req, res) => {
  const group = req.body
  await groupDatabase.save(group)
  res.send({ result: "success" })
})

router.delete("/", async (req, res) => {
  const group = req.body
  await groupDatabase.remove(group)
  res.send({ result: "success" })
})

router.get("/user-list/:groupId", async (req, res) => {
  const { groupId } = req.params

  const group = await groupDatabase.findOne({
    where: {
      id: parseInt(groupId),
    },
    relations: {
      users: true,
    },
  })
  res.send(group.users)
})

export default router
