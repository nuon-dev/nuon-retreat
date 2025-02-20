import express, { Router } from "express"

import authRouter from "./authRouter"
import adminRouter from "./admin/adminRouter"
import retreatRouter from "./retreat/retreatRouter"
import inOutInfoRouter from "./retreat/inOutInfoRouter"
import cors from "cors"
import { sharingVideoPath } from "./retreat/sharingRouter"

const router: Router = express.Router()

router.use(cors())

router.use("/sharing/image", express.static(sharingVideoPath))

router.use("/auth", authRouter)
router.use("/admin", adminRouter)
router.use("/retreat", retreatRouter)
router.use("/in-out-info", inOutInfoRouter)

export default router
