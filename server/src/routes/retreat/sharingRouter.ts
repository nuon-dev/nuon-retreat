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
        id: true,
      },
    },
    relations: {
      writer: true,
    },
    where: {
      visible: true,
    },
    order: {
      createAt: "DESC",
    },
  })

  res.send(foundSharingText)
})

router.post("/", async (req, res) => {
  const { content } = req.body
  const user = await getUserFromToken(req)

  if (!user) {
    res.status(400).send({ result: "fail" })
    return
  }

  const newSharingText = sharingTextDatabase.create({
    content,
    writer: user,
  })

  await sharingTextDatabase.save(newSharingText)
  res.send({ result: "success" })
})

router.post("/delete", async (req, res) => {
  const user = await getUserFromToken(req)
  const { id } = req.body

  if (!user) {
    res.status(400).send({ result: "fail" })
    return
  }

  const foundSharingText = await sharingTextDatabase.findOne({
    where: {
      id,
    },
    relations: {
      writer: true,
    },
  })

  if (!foundSharingText) {
    res.status(400).send({ result: "fail" })
    return
  }

  if (foundSharingText.writer.id !== user.id) {
    res.status(400).send({ result: "fail" })
    return
  }

  foundSharingText.visible = false
  await sharingTextDatabase.save(foundSharingText)
  res.send({ result: "success" })
})

router.get("/images", async (req, res) => {
  const foundSharingImage = await sharingImageDatabase.find({
    select: {
      id: true,
      url: true,
      createAt: true,
      tags: true,
      visible: true,
      writer: {
        name: true,
        id: true,
      },
    },
    where: {
      visible: true,
    },
    relations: {
      writer: true,
    },
    order: {
      createAt: "DESC",
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

  if (!file) {
    res.status(400).send({ result: "fail" })
    return
  }

  if (!user) {
    res.status(400).send({ result: "fail" })
    return
  }

  const newSharingImage = sharingImageDatabase.create({
    url: file.filename,
    writer: user,
    tags: req.body.tags,
  })

  await sharingImageDatabase.save(newSharingImage)
  res.send({ result: "success" })
})

router.post("/image-delete", async (req, res) => {
  const user = await getUserFromToken(req)
  const { id } = req.body

  if (!user) {
    res.status(400).send({ result: "fail" })
    return
  }

  const foundSharingImage = await sharingImageDatabase.findOne({
    where: {
      id,
    },
    relations: {
      writer: true,
    },
  })

  if (!foundSharingImage) {
    res.status(400).send({ result: "fail" })
    return
  }

  if (foundSharingImage.writer.id !== user.id) {
    res.status(400).send({ result: "fail" })
    return
  }

  foundSharingImage.visible = false
  await sharingImageDatabase.save(foundSharingImage)
  res.send({ result: "success" })
})

export default router
