import express from "express"
import bodyParser from "body-parser"
import apiRouter from "./routes"
import dataSource, {
  attendInfoDatabase,
  userDatabase,
} from "./model/dataSource"
import { InOutInfo } from "./entity/inOutInfo"
import { deleteUser } from "./util"

const app = express()
const port = 8000

app.use(bodyParser.json())

const router = express.Router()
app.use("/", apiRouter)

app.listen(port, async () => {
  await Promise.all([dataSource.initialize()])
  //dataSource.dropDatabase()
  const userList = await userDatabase.find({
    relations: {
      roomAssignment: true,
      groupAssignment: true,
      permissions: true,
      inOutInfos: true,
    },
  })
  const normalUser = userList.filter((user) =>
    user.kakaoId.startsWith("normal")
  )

  console.log(normalUser.length)

  const pro = normalUser.map(async (user) => {
    return await deleteUser(user)
  })
  await Promise.all(pro)
  console.log("start server")
})

app.get("/", async (req, res) => {
  res.send("running server")
})
