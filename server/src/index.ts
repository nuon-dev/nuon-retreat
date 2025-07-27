import express from "express"
import bodyParser from "body-parser"
import apiRouter from "./routes"
import dataSource from "./model/dataSource"
import fs from "fs"
import https from "https"
import cors from "cors"

const app = express()
const port = 8000

app.use(bodyParser.json())
app.use(cors())
app.use("/", apiRouter)

const is_dev = process.env.NODE_ENV === "development"

var server

if (is_dev) {
  server = app
} else {
  var privateKey = fs.readFileSync(
    "/etc/letsencrypt/live/nuon.iubns.net/privkey.pem"
  )
  var certificate = fs.readFileSync(
    "/etc/letsencrypt/live/nuon.iubns.net/cert.pem"
  )
  var ca = fs.readFileSync("/etc/letsencrypt/live/nuon.iubns.net/chain.pem")
  const credentials = { key: privateKey, cert: certificate, ca: ca }

  server = https.createServer(credentials, app)
}

server.listen(port, async () => {
  await Promise.all([dataSource.initialize()])
  
  // 마이그레이션 자동 실행
  try {
    await dataSource.runMigrations()
    console.log("Migrations executed successfully")
  } catch (error) {
    console.error("Migration failed:", error)
  }
  
  //dataSource.dropDatabase()
  console.log("start server")
})

app.get("/", async (req, res) => {
  res.send("running server")
})
