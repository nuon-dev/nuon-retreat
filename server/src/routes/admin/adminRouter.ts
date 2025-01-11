import express from "express"
import communityRouter from "./communityRouter"
import soonRouter from "./soonRouter"

const router = express.Router()

router.use("/community", communityRouter)
router.use("/soon", soonRouter)

export default router
