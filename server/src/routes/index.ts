import express, { Router } from "express"

import authRouter from "./authRouter"
import infoRouter from "./infoRouter"
import adminRouter from "./adminRouter"
import statusRouter from "./statusRouter"
import newLaity from "./new-laity"
import happyFestivalRouter from "./happyFestivalRouter"

const router: Router = express.Router()

router.use("/auth", authRouter)
router.use("/info", infoRouter)
router.use("/admin", adminRouter)
router.use("/status", statusRouter)
router.use("/new-laity", newLaity)
router.use("/happy-festival", happyFestivalRouter)

export default router
