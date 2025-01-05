import express, { Router } from "express"

import authRouter from "./authRouter"
import infoRouter from "./infoRouter"
import adminRouter from "./adminRouter"
import statusRouter from "./statusRouter"
import cors from "cors"
import { joyfulJourneyManageDatabase, userDatabase } from "../model/dataSource"

const router: Router = express.Router()

router.use(cors())
router.use("/auth", authRouter)
router.use("/info", infoRouter)
router.use("/admin", adminRouter)
router.use("/status", statusRouter)

export default router
