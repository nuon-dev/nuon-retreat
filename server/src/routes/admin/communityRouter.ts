import express from "express"
import { communityDatabase, userDatabase } from "../../model/dataSource"
import { IsNull } from "typeorm"

const router = express.Router()

router.get("/", async (req, res) => {
  const groupList = await communityDatabase.find({
    relations: {
      parent: true,
    },
    order: {
      name: "ASC",
    },
  })
  res.send(groupList)
})

router.post("/", async (req, res) => {
  const group = req.body
  await communityDatabase.insert(group)
  res.send({ result: "success" })
})

router.put("/", async (req, res) => {
  const group = req.body
  await communityDatabase.save(group)
  res.send({ result: "success" })
})

router.delete("/", async (req, res) => {
  const group = req.body
  await communityDatabase.remove(group)
  res.send({ result: "success" })
})

router.get("/user-list/:groupId", async (req, res) => {
  const { groupId } = req.params

  const groupList = await communityDatabase.find({
    where: {
      parent: {
        id: parseInt(groupId),
      },
    },
    relations: {
      users: {
        community: true,
      },
    },
  })
  res.send(groupList)
})

router.get("/no-group-user-list", async (req, res) => {
  const userList = await userDatabase.find({
    where: {
      community: IsNull(),
    },
  })
  res.send(userList)
})

router.post("/set-user", async (req, res) => {
  const { groupId, userId } = req.body
  await userDatabase.update(userId, { community: groupId })
  res.send({ result: "success" })
})

export default router
