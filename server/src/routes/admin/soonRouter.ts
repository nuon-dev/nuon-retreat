import express from "express"
import { hasPermission } from "../../util"
import { PermissionType } from "../../entity/types"
import { attendDataDatabase, userDatabase } from "../../model/dataSource"
import { In } from "typeorm"

const router = express.Router()

router.get("/get-all-user", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.userList))) {
    res.sendStatus(401)
    return
  }

  const foundUser = await userDatabase.find()

  res.send(foundUser)
})

router.post("/insert-user", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.editUserData))) {
    res.sendStatus(401)
    return
  }

  const user = req.body
  await userDatabase.insert(user)

  res.status(200).send({ message: "success" })
})

router.put("/update-user", async (req, res) => {
  const token = req.header("token")
  if (false === (await hasPermission(token, PermissionType.editUserData))) {
    res.sendStatus(401)
    return
  }

  const user = req.body
  await userDatabase.save(user)

  res.status(200).send({ message: "success" })
})

router.get("/get-soon-list", async (req, res) => {
  const communityIds = req.query.ids

  if (!communityIds) {
    res.status(400).send({ message: "No community IDs provided" })
    return
  }

  const ids = communityIds
    .toString()
    .split(",")
    .map((id) => parseInt(id, 10))

  const soonList = await userDatabase.find({
    where: {
      community: {
        id: In(ids),
      },
    },
    select: {
      id: true,
      name: true,
      community: {
        id: true,
        name: true,
      },
    },
    relations: {
      community: true,
    },
  })

  res.status(200).send(soonList)
})

router.get("/user-attendance", async (req, res) => {
  const userIds = req.query.ids

  if (!userIds) {
    res.status(400).send({ message: "No user IDs provided" })
    return
  }

  const ids = userIds
    .toString()
    .split(",")
    .map((id) => parseInt(id, 10))

  const attendDataList = await attendDataDatabase.find({
    where: {
      user: {
        id: In(ids),
      },
    },
    relations: {
      user: true,
      worshipSchedule: true,
    },
  })
  res.status(200).send(attendDataList)
})

export default router
