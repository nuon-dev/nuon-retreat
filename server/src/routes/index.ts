import express, { Router } from "express";

import authRouter from "./authRouter";
import infoRouter from './infoRouter';
import adminRouter from './adminRouter';
import developRouter from './develop';

const router: Router = express.Router();

router.use('/auth', authRouter);
router.use('/info', infoRouter);
router.use('/admin', adminRouter)
router.use('/develop', developRouter);


export default router;