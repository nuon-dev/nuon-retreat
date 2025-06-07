import express from "express"

import {
  attendDataDatabase,
  communityDatabase,
  userDatabase,
  worshipScheduleDatabase,
} from "../../model/dataSource"
import { IsNull } from "typeorm"
import { getUserFromToken } from "../../util"

const router = express.Router()

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
        id: user.id,
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

router.get("/worship-schedule", async (req, res) => {
  const schedules = await worshipScheduleDatabase.find({
    order: {
      date: "DESC",
    },
  })
  if (!schedules) {
    return res.status(404).send({ error: "No worship schedules found" })
  }
  res.status(200).send(schedules)
})

router.get("/attendance", async (req, res) => {
  const user = await getUserFromToken(req)
  if (!user) {
    return res.status(401).send({ error: "Unauthorized" })
  }
  const scheduleId = parseInt(req.query.scheduleId as string, 10)
  if (isNaN(scheduleId)) {
    return res.status(400).send({ error: "Invalid schedule ID" })
  }

  const attendDataList = await attendDataDatabase.find({
    where: {
      worshipSchedule: {
        id: scheduleId,
      },
      user: {
        community: {
          id: user.community.id,
        },
      },
    },
    relations: {
      user: {
        community: true,
      },
      worshipSchedule: true,
    },
  })

  res.status(200).send(attendDataList)
})

router.post("/attendance", async (req, res) => {
  const user = await getUserFromToken(req)
  if (!user) {
    return res.status(401).send({ error: "Unauthorized" })
  }
  const { scheduleId, attendData } = req.body
  if (!scheduleId || !attendData) {
    return res.status(400).send({ error: "Missing required fields" })
  }

  const worshipSchedule = await worshipScheduleDatabase.findOne({
    where: { id: scheduleId },
  })
  if (!worshipSchedule) {
    return res.status(404).send({ error: "Worship schedule not found" })
  }

  const attendDataList = attendData.map(async (data: any) => {
    const foundAttendData = await attendDataDatabase.findOne({
      where: {
        user: { id: data.user.id },
        worshipSchedule: { id: worshipSchedule.id },
      },
    })
    if (foundAttendData) {
      foundAttendData.isAttend = data.isAttend
      foundAttendData.memo = data.memo || ""
      return foundAttendData
    }
    return attendDataDatabase.create({
      memo: data.memo || "",
      worshipSchedule,
      user: { id: data.user.id },
      isAttend: data.isAttend,
    })
  })

  try {
    await attendDataDatabase.save(await Promise.all(attendDataList))
    res.status(201).send(attendDataList)
  } catch (error) {
    console.error("Error saving attendance data:", error)
    res.status(500).send({ error: "Failed to save attendance data" })
  }
})

export default router
