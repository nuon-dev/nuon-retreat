import express, { Router } from "express"

import authRouter from "./authRouter"
import adminRouter from "./admin/adminRouter"
import RetreatRouter from "./retreat/retreatRouter"
import cors from "cors"

const router: Router = express.Router()

router.use(cors())
router.use("/auth", authRouter)
router.use("/admin", adminRouter)
router.use("/retreat", RetreatRouter)

export default router
