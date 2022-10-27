import express from 'express'
import {attendInfoDatabase, userDatabase} from '../model/dataSource'
import { InOutInfo } from '../entity/inOutInfo'

const router = express.Router()

router.post('/save-attend-time', async (req, res) => {
    const data = req.body

    const userId: number = data.userId
    const inOutDataList: Array<InOutInfo> = data.inOutData

    const foundUser = await userDatabase.findOneBy({
        id: userId
    })

    try{
        for(const data of inOutDataList){
            const inOutInfo = new InOutInfo()
            inOutInfo.user = foundUser
            inOutInfo.inOutType = data.inOutType
            inOutInfo.position = data.position
            inOutInfo.time = data.time

            await attendInfoDatabase.save(inOutInfo)
        }
        
        res.send({result: 'success'})
    }catch(e){
        res.send(e)
    }
})

export default router