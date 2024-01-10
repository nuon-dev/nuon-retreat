import express from "express"
import { attendInfoDatabase, userDatabase } from "../model/dataSource"
import { InOutInfo } from "../entity/inOutInfo"

const router = express.Router()

router.post("/save-attend-time", async (req, res) => {
  const data = req.body

  const userId: number = data.userId
  const inOutData: InOutInfo = data.inOutData

  let foundUser
  try {
    foundUser = await userDatabase.findOneByOrFail({
      id: userId,
    })
  } catch {
    res.send({ result: "error" })
    return
  }

  try {
    if (inOutData.id) {
      await attendInfoDatabase.save(inOutData)
    } else {
      const inOutInfo = new InOutInfo()
      inOutInfo.user = foundUser
      inOutInfo.id = inOutData.id
      inOutInfo.inOutType = inOutData.inOutType
      inOutInfo.day = inOutData.day
      inOutInfo.time = inOutData.time
      inOutInfo.position = inOutData.position
      inOutInfo.howToMove = inOutData.howToMove
      await attendInfoDatabase.save(inOutInfo)
    }
    res.send({ result: "success" })
  } catch (e) {
    console.log(e)
    res.send(e)
  }
})

router.post("/delete-attend-time", async (req, res) => {
  const data = req.body
  const inOutInfo: InOutInfo = data.inOutInfo

  try {
    await attendInfoDatabase.delete(inOutInfo)
    res.send({ result: "success" })
  } catch (e) {
    res.send(e)
  }
})

router.get("/my-mate", async (req, res) => {
  const token = req.header("token")

  const foundUser = await userDatabase.findOne({
    where: {
      token,
    },
    relations: {
      roomAssignment: true,
      groupAssignment: true,
    },
  })

  if (!foundUser) {
    res.send({ error: "사용자 정보 없음" })
    return
  }

  var roomMate = []
  if (foundUser.roomAssignment) {
    roomMate = await userDatabase.find({
      select: {
        name: true,
        age: true,
        sex: true,
      },
      where: {
        roomAssignment: {
          roomNumber: foundUser.roomAssignment.roomNumber,
        },
      },
    })
  }

  var groupMate
  if (foundUser.groupAssignment) {
    groupMate = await userDatabase.find({
      select: {
        name: true,
        age: true,
        sex: true,
      },
      where: {
        groupAssignment: {
          groupNumber: foundUser.groupAssignment.groupNumber,
        },
      },
    })
  }

  res.send({
    groupMate,
    roomMate,
  })
})

export default router
