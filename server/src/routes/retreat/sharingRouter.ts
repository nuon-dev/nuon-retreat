import express from "express"
import {
  sharingImageDatabase,
  sharingTextDatabase,
} from "../../model/dataSource"
import multer from "multer"
import { getUserFromToken } from "../../util"

const router = express.Router()

router.get("/", async (req, res) => {
  const foundSharingText = await sharingTextDatabase.find({
    select: {
      id: true,
      content: true,
      createAt: true,
      visible: true,
      writer: {
        name: true,
      },
    },
    relations: {
      writer: true,
    },
  })

  res.send(foundSharingText)
})

router.post("/", async (req, res) => {
  const { content } = req.body
  const user = await getUserFromToken(req)

  const newSharingText = sharingTextDatabase.create({
    content,
    writer: user,
  })

  await sharingTextDatabase.save(newSharingText)
  res.send({ result: "success" })
})

router.get("/images", async (req, res) => {
  const user = await getUserFromToken(req)

  const foundSharingImage = await sharingImageDatabase.find({
    where: {
      visible: true,
    },
  })

  res.send(foundSharingImage)
})

export const sharingVideoPath = "../sharing/image/"

const uploadFiles = multer({
  dest: sharingVideoPath,
})

router.put("/image", uploadFiles.single("image"), async (req, res) => {
  const user = await getUserFromToken(req)
  const { file } = req

  const newSharingImage = sharingImageDatabase.create({
    url: file.filename,
    writer: user,
  })

  await sharingImageDatabase.save(newSharingImage)
  res.send({ result: "success" })
})

export default router
