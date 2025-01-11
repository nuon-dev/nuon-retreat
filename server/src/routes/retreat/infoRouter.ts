// import express from "express"
// import { inOutInfoDatabase, userDatabase } from "../../model/dataSource"
// import { InOutInfo } from "../../entity/inOutInfo"

// const router = express.Router()

// router.post("/save-attend-time", async (req, res) => {
//   const data = req.body

//   const userId: number = data.userId
//   const inOutDataList: InOutInfo[] = data.inOutData

//   let foundUser
//   try {
//     foundUser = await userDatabase.findOneByOrFail({
//       id: userId,
//     })
//   } catch {
//     res.send({ result: "error" })
//     return
//   }

//   try {
//     for (const data of inOutDataList) {
//       const inOutInfo = new InOutInfo()
//       inOutInfo.user = foundUser
//       inOutInfo.id = data.id
//       inOutInfo.inOutType = data.inOutType
//       inOutInfo.day = data.day
//       inOutInfo.time = data.time
//       inOutInfo.position = data.position
//       inOutInfo.howToMove = data.howToMove

//       await inOutInfoDatabase.save(inOutInfo)
//     }

//     res.send({ result: "success" })
//   } catch (e) {
//     res.send(e)
//   }
// })

// router.post("/delete-attend-time", async (req, res) => {
//   const data = req.body
//   const inOutInfo: InOutInfo = data.inOutInfo

//   try {
//     await inOutInfoDatabase.delete(inOutInfo)
//     res.send({ result: "success" })
//   } catch (e) {
//     res.send(e)
//   }
// })

// router.get("/my-mate", async (req, res) => {
//   const token = req.header("token")

//   const foundUser = await userDatabase.findOne({
//     where: {
//       token,
//     },
//     relations: {
//       roomAssignment: true,
//       groupAssignment: true,
//     },
//   })

//   if (!foundUser) {
//     res.send({ error: "사용자 정보 없음" })
//     return
//   }

//   var roomMate = []
//   if (foundUser.roomAssignment) {
//     roomMate = await userDatabase.find({
//       select: {
//         name: true,
//         age: true,
//         sex: true,
//       },
//       where: {
//         roomAssignment: {
//           roomNumber: foundUser.roomAssignment.roomNumber,
//         },
//       },
//     })
//   }

//   var groupMate
//   if (foundUser.groupAssignment) {
//     groupMate = await userDatabase.find({
//       select: {
//         name: true,
//         age: true,
//         sex: true,
//       },
//       where: {
//         groupAssignment: {
//           groupNumber: foundUser.groupAssignment.groupNumber,
//         },
//       },
//     })
//   }

//   res.send({
//     groupMate,
//     roomMate,
//   })
// })

// export default router
