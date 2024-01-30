import express from "express"
import bodyParser from "body-parser"
import apiRouter from "./routes"
import dataSource, { userDatabase } from "./model/dataSource"
import { deleteUser } from "./util"
import fs from "fs"
import https from "https"
import cors from "cors"

const app = express()
const port = 8000

app.use(bodyParser.json())
app.use(cors())
app.use("/", apiRouter)

const is_dev = false

var server

if (is_dev) {
  server = app
} else {
  var privateKey = fs.readFileSync(
    "/etc/letsencrypt/live/iubns.net/privkey.pem"
  )
  var certificate = fs.readFileSync("/etc/letsencrypt/live/iubns.net/cert.pem")
  var ca = fs.readFileSync("/etc/letsencrypt/live/iubns.net/chain.pem")
  const credentials = { key: privateKey, cert: certificate, ca: ca }

  server = https.createServer(credentials, app)
}

server.listen(port, async () => {
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

  const pro = normalUser.map(async (user) => {
    return await deleteUser(user)
  })
  await Promise.all(pro)
  console.log("start server")
})

app.get("/", async (req, res) => {
  res.send("running server")
})
