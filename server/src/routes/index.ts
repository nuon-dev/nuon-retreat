import express, { Router } from "express"

import authRouter from "./authRouter"
import infoRouter from "./infoRouter"
import adminRouter from "./adminRouter"

const router: Router = express.Router()

router.use("/auth", authRouter)
router.use("/info", infoRouter)
router.use("/admin", adminRouter)

export default router
