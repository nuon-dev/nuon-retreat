import express from "express"
import { communityDatabase, userDatabase } from "../../model/dataSource"
import { IsNull } from "typeorm"

const router = express.Router()

router.get("/", async (req, res) => {
  const groupList = await communityDatabase.find({
    select: {
      name: true,
      id: true,
      children: true,
      leader: {
        id: true,
        name: true,
      },
      deputyLeader: {
        id: true,
        name: true,
      },
    },
    relations: {
      parent: true,
      children: true,
      leader: true,
      deputyLeader: true,
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
    select: {
      users: {
        name: true,
        yearOfBirth: true,
        id: true,
      },
    },
    where: {
      parent: {
        id: groupId === "0" ? IsNull() : parseInt(groupId),
      },
    },
    relations: {
      users: {
        community: true,
      },
      children: {
        leader: true,
        deputyLeader: true,
      },
    },
  })
  res.send(groupList)
})

router.get("/no-community-user-list", async (req, res) => {
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

router.put("/save-leader", async (req, res) => {
  const { groupId, leaderId } = req.body
  const group = await communityDatabase.findOne({
    where: { id: groupId },
    relations: ["leader"],
  })
  if (!group) {
    return res.status(404).send({ error: "Group not found" })
  }

  if (!leaderId) {
    group.leader = null
    await communityDatabase.save(group)
    return res.send({ result: "success" })
  }

  const leader = await userDatabase.findOne({ where: { id: leaderId } })
  if (!leader) {
    return res.status(404).send({ error: "Leader not found" })
  }
  group.leader = leader
  await communityDatabase.save(group)

  res.send({ result: "success" })
})

router.put("/save-deputy-leader", async (req, res) => {
  const { groupId, deputyLeaderId } = req.body
  const group = await communityDatabase.findOne({
    where: { id: groupId },
    relations: ["deputyLeader"],
  })
  if (!group) {
    return res.status(404).send({ error: "Group not found" })
  }

  if (!deputyLeaderId) {
    group.deputyLeader = null
    await communityDatabase.save(group)
    return res.send({ result: "success" })
  }

  const deputyLeader = await userDatabase.findOne({
    where: { id: deputyLeaderId },
  })
  if (!deputyLeader) {
    return res.status(404).send({ error: "Deputy leader not found" })
  }
  group.deputyLeader = deputyLeader
  await communityDatabase.save(group)

  res.send({ result: "success" })
})

export default router
