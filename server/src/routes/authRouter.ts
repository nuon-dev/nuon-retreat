import express from 'express'
import { hashCode, isTokenExpire } from '../util'
import {attendInfoDatabase, groupAssignmentDatabase, roomAssignmentDatabase, userDatabase} from '../model/dataSource'
import { User } from '../entity/user'
import { RoomAssignment } from '../entity/roomAssignment'
import { GroupAssignment } from '../entity/groupAssignment'
import { getHashes } from 'crypto'

const router = express.Router()

router.post('/edit-user', async (req, res) => {
    const user = req.body

    await userDatabase.save(user as User)
    res.send({result: 'success', userId: user.id, token: user.token})
})


router.post('/check-token', async (req, res) => {
    const data = req.body

    if(!data.token){
        res.send({result: 'false'})
        return
    }
    
    const foundUser = await userDatabase.findOneBy({
        token: data.token,
    })

    if(!foundUser){
        res.send({result: 'false'})
        return
    }

    if(isTokenExpire(foundUser.expire)){
        res.send({result: 'fasle'})
        return
    }

    const inoutInfoList = await attendInfoDatabase.findBy({
        user: foundUser
    })


    res.send({
        result: 'true',
        userData: foundUser,
        inoutInfoList,
    })
})

router.post("/receipt-record", async (req, res) => {
    const body = req.body

    const kakaoId = body.kakaoId
    const foundUser = await userDatabase.findOneBy({
        kakaoId: kakaoId
    })

    if(foundUser) {
        foundUser.token = hashCode(foundUser.kakaoId + new Date().getTime())
        const expireDay = new Date()
        expireDay.setDate(expireDay.getDate() + 21)
        foundUser.expire = expireDay
        userDatabase.save(foundUser)
        res.send({token: foundUser.token})
    }else{
        const now = new Date()
        const createUser = new User()
        createUser.kakaoId = kakaoId
        createUser.createAt = now
        createUser.token = hashCode(kakaoId + now.getTime().toString())
        createUser.expire = new Date(now.setDate(now.getDate() + 7))
        await userDatabase.save(createUser)
        res.send({token: createUser.token})
    }
})


export default router