import express from 'express'
import {attendInfoDatabase} from '../model/dataSource'
import { InOutInfo } from '../entity/inOutInfo'

const router = express.Router()

router.post('/save-attend-time', async (req, res) => {
    const data = req.body

    const userId: number = data.userId
    const inOutDataList: Array<InOutInfo> = data.inOutData

    try{
        for(const data of inOutDataList){
            const inOutInfo = new InOutInfo()
            inOutInfo.userId = userId
            inOutInfo.inOutType = data.inOutType
            inOutInfo.position = data.position
            inOutInfo.time = data.time

            const result = await attendInfoDatabase.save(inOutInfo)
        }
        
        res.send({result: 'success'})
    }catch(e){
        res.send(e)
    }
})

export default router