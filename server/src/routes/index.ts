import express, { Router } from "express"

import authRouter from "./authRouter"
//import infoRouter from "./retreat/infoRouter"
import adminRouter from "./admin/adminRouter"
import cors from "cors"

const router: Router = express.Router()

router.use(cors())
router.use("/auth", authRouter)
//router.use("/info", infoRouter)
router.use("/admin", adminRouter)

export default router
