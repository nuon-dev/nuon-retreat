import express from "express"
import { hashCode, isTokenExpire } from "../util"
import {
  attendInfoDatabase,
  groupAssignmentDatabase,
  roomAssignmentDatabase,
  userDatabase,
} from "../model/dataSource"
import { User } from "../entity/user"
import { RoomAssignment } from "../entity/roomAssignment"
import { GroupAssignment } from "../entity/groupAssignment"
import { HowToMove } from "../entity/types"

const router = express.Router()

router.post("/edit-user", async (req, res) => {
  const user = req.body as User

  user.isCancel = false
  const foundUser = await userDatabase.save(user)

  if (user.howToGo === HowToMove.together) {
    const infoList = await attendInfoDatabase.find({
      relations: {
        rideCarInfo: true,
        user: true,
      },
      where: {
        rideCarInfo: {
          user: {
            id: foundUser.id,
          },
        },
      },
    })
    const outPromise = infoList.map((info) => {
      info.rideCarInfo = null
      return attendInfoDatabase.save(info)
    })
    await Promise.all(outPromise)
    await attendInfoDatabase.delete({
      user: foundUser,
    })
  }

  res.send({ result: "success", userId: user.id, token: user.token })
})

router.post("/check-token", async (req, res) => {
  const data = req.body

  if (!data.token) {
    res.send({ result: "false" })
    return
  }

  const foundUser = await userDatabase.findOne({
    where: {
      token: data.token,
    },
    relations: {
      roomAssignment: true,
      groupAssignment: true,
    },
  })

  if (!foundUser) {
    res.send({ result: "false" })
    return
  }

  if (isTokenExpire(foundUser.expire)) {
    res.send({ result: "false" })
    return
  }

  const inoutInfoList = await attendInfoDatabase.findBy({
    user: foundUser,
  })

  res.send({
    result: "true",
    userData: foundUser,
    inoutInfoList,
  })
})

router.post("/receipt-record", async (req, res) => {
  const body = req.body

  const kakaoId = body.kakaoId
  const foundUser = await userDatabase.findOneBy({
    kakaoId: kakaoId,
  })

  if (foundUser) {
    foundUser.token = hashCode(foundUser.kakaoId + new Date().getTime())
    const expireDay = new Date()
    expireDay.setDate(expireDay.getDate() + 21)
    foundUser.expire = expireDay
    await userDatabase.save(foundUser)
    res.send({ token: foundUser.token })
  } else {
    const roomAssignment = new RoomAssignment()
    await roomAssignmentDatabase.save(roomAssignment)

    const groupAssignment = new GroupAssignment()
    await groupAssignmentDatabase.save(groupAssignment)

    const now = new Date()
    const createUser = new User()
    createUser.kakaoId = kakaoId
    createUser.createAt = new Date()
    createUser.roomAssignment = roomAssignment
    createUser.groupAssignment = groupAssignment
    createUser.sex = "man"
    createUser.token = hashCode(kakaoId + now.getTime().toString())
    createUser.expire = new Date(now.setDate(now.getDate() + 7))
    await userDatabase.save(createUser)
    res.send({ token: createUser.token })
  }
})

export default router
