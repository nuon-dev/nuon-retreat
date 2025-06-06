import express from "express"

import manageRouter from "./manage"
import { communityDatabase, userDatabase } from "../../model/dataSource"
import { IsNull } from "typeorm"
import { getUserFromToken } from "../../util"

const router = express.Router()

router.use("/", manageRouter)

router.get("/my-group-info", async (req, res) => {
  const user = await getUserFromToken(req)
  if (!user) {
    return res.status(401).send({ error: "Unauthorized" })
  }
  const group = await communityDatabase.findOne({
    select: {
      id: true,
      name: true,
      users: {
        id: true,
        name: true,
        yearOfBirth: true,
        phone: true,
        gender: true,
      },
      children: true,
    },
    where: [
      {
        leader: {
          id: user.id,
        },
        children: {
          id: IsNull(),
        },
      },
      {
        deputyLeader: {
          id: user.id,
        },
        children: {
          id: IsNull(),
        },
      },
    ],
    relations: {
      users: true,
      children: true,
    },
  })
  if (!group) {
    return res.status(404).send({ error: "Group not found" })
  }
  group.users = group.users.map(
    (user) =>
      ({
        name: user.name,
        yearOfBirth: user.yearOfBirth,
        phone: user.phone,
        gender: user.gender,
        kakaoId: !user.kakaoId,
      } as any)
  )

  res.send(group)
})

router.post("/add-user", async (req, res) => {
  const user = await getUserFromToken(req)
  if (!user) {
    return res.status(401).send({ error: "Unauthorized" })
  }
  const { userName, yearOfBirth, gender, phone } = req.body
  if (!userName || !yearOfBirth || !gender || !phone) {
    return res.status(400).send({ error: "Missing required fields" })
  }

  const newSoon = userDatabase.create({
    name: userName,
    yearOfBirth: parseInt(yearOfBirth, 10),
    gender,
    phone,
    community: user.community,
  })

  try {
    await userDatabase.save(newSoon)
    res.status(201).send(newSoon)
  } catch (error) {
    console.error("Error saving new user:", error)
    res.status(500).send({ error: "Failed to add user" })
  }
})

export default router
