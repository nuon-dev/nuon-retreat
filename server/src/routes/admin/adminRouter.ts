import express from "express"
import communityRouter from "./communityRouter"
import soonRouter from "./soonRouter"
import worshipScheduleRouter from "./worshipSchedule"

const router = express.Router()

router.use("/community", communityRouter)
router.use("/soon", soonRouter)
router.use("/worship-schedule", worshipScheduleRouter)

export default router
