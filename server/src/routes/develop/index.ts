import express, { Router } from "express"

import { User } from "../../entity/user"
import { AttendType, HowToGo } from "../../entity/types"
import {
  attendInfoDatabase,
  groupAssignmentDatabase,
  permissionDatabase,
  roomAssignmentDatabase,
  userDatabase,
} from "../../model/dataSource"
import { InOutInfo } from "../../entity/inOutInfo"
import { RoomAssignment } from "../../entity/roomAssignment"
import { GroupAssignment } from "../../entity/groupAssignment"

const router: Router = express.Router()

router.post("/insert-data", async (req, res) => {
  const body = req.body

  const tableName = body.tableName
  const data: string = body.data
  const list: Array<any> = body.list

  if (tableName === "user") {
    const rows = data.split("\n")
    for (let index = 0; index < rows.length - 1; index++) {
      const roomAssignment = new RoomAssignment()
      await roomAssignmentDatabase.save(roomAssignment)

      const groupAssignment = new GroupAssignment()
      await groupAssignmentDatabase.save(groupAssignment)

      const row = rows[index].split(",")
      const user = new User()
      user.id = Number.parseInt(row[0])
      user.name = row[1]
      user.age = Number.parseInt(row[3])
      user.sex = row[4]
      user.phone = row[5]
      user.attendType = row[6] as AttendType
      user.etc = row[7]
      user.deposit = row[8] === "true"
      user.token = row[9]
      user.expire = new Date(row[10])
      user.isCancell = row[11] === "true"
      user.howToGo = row[12].toString() as HowToGo
      user.isSuperUser = row[13] === "true"
      user.createAt = new Date(row[14])
      user.roomAssignment = roomAssignment
      user.groupAssignment = groupAssignment

      await userDatabase.save(user)
    }
  } else if (tableName === "info") {
    const rows = list as Array<InOutInfo>
    rows.forEach(async (info) => {
      await attendInfoDatabase.save(info)
    })
  }
  res.send("good")
})

router.get("/remove-duplicated-user-data", async (req, res) => {
  const allUser = await userDatabase.find()
  allUser.forEach(async (user) => {
    const cloneUser = JSON.parse(JSON.stringify(user))
    delete cloneUser.id
    delete cloneUser.token
    delete cloneUser.createAt
    delete cloneUser.expire
    const result = await userDatabase.countBy(cloneUser)
    if (result > 1) {
      const dubplList = await userDatabase.findBy(cloneUser)
      await deleteUser(dubplList[1])
    }
  })

  const count = await userDatabase.query(
    "SELECT phone, COUNT(phone) FROM user GROUP BY phone HAVING COUNT(phone) > 1;"
  )

  /*
    const allInfo = await attendInfoDatabase.find({
        select: {
            user: {
                id: true
            }
        }
    })
    allInfo.forEach(async info => {
        const cloneInfo = JSON.parse(JSON.stringify(info))
        delete cloneInfo.id
        delete cloneInfo.userInTheCar
        delete cloneInfo.rideCarInfo

        console.log(cloneInfo)
        
        const result = await attendInfoDatabase.countBy(info)
        if(result > 1){
            const dubplList = await attendInfoDatabase.findBy(cloneInfo)
            await attendInfoDatabase.delete(dubplList[1])
        }
    })
    */

  res.send(count)
})

router.get("/fix-createAt", async (req, res) => {
  const allUser = await userDatabase.find()
  allUser.forEach(async (user) => {
    const date = new Date(user.createAt)
    date.setDate(date.getDate() - 7)
    user.createAt = date
    await userDatabase.save(user)
  })

  res.send("good-createAt")
})

async function deleteUser(user) {
  await attendInfoDatabase.delete({
    user: user,
  })
  await permissionDatabase.delete({
    user: user,
  })
  await userDatabase.remove(user)
  return
}

export default router
