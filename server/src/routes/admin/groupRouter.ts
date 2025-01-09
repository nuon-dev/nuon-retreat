import express from "express"
import { groupDatabase, userDatabase } from "../../model/dataSource"
import { IsNull } from "typeorm"

const router = express.Router()

router.get("/", async (req, res) => {
  const groupList = await groupDatabase.find({
    relations: {
      parent: true,
    },
  })
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

  const groupList = await groupDatabase.find({
    where: {
      parent: {
        id: parseInt(groupId),
      },
    },
    relations: {
      users: {
        group: true,
      },
    },
  })
  res.send(groupList)
})

router.get("/no-group-user-list", async (req, res) => {
  const userList = await userDatabase.find({
    where: {
      group: IsNull(),
    },
  })
  res.send(userList)
})

router.post("/set-user", async (req, res) => {
  const { groupId, userId } = req.body
  await userDatabase.update(userId, { group: groupId })
  res.send({ result: "success" })
})

export default router
