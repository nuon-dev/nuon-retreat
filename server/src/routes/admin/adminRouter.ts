import express from "express"
import groupRouter from "./groupRouter"
import soonRouter from "./soonRouter"

const router = express.Router()

router.use("/group", groupRouter)
router.use("/soon", soonRouter)

export default router
