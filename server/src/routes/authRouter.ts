import express from 'express'
import { hashCode, isTokenExpire } from '../util'
import {attendInfoDatabase, groupAssignmentDatabase, roomAssignmentDatabase, userDatabase} from '../model/dataSource'
import { User } from '../entity/user'
import { RoomAssignment } from '../entity/roomAssignment'
import { GroupAssignment } from '../entity/groupAssignment'

const router = express.Router()

router.post('/login', async (req, res) => {
    const data = req.body

    const foundUser = await userDatabase.findOneBy({
        name: data.userName,
        password: hashCode(data.userPassword),
    })
    if(!foundUser){
        res.send({result: 'fail'})
    }else{
        foundUser.token = hashCode(foundUser.password + new Date().getTime())
        const expireDay = new Date()
        expireDay.setDate(expireDay.getDate() + 7)
        foundUser.expire = expireDay
        userDatabase.save(foundUser)
        res.send({result: 'success', token: foundUser.token})
    }
})

router.post('/join', async (req, res) => {
    const data = req.body

    const roomAssignment = new RoomAssignment()
    await roomAssignmentDatabase.save(roomAssignment)

    const groupAssignment = new GroupAssignment()
    await groupAssignmentDatabase.save(groupAssignment)

    const userCount = await userDatabase.count()

    const now = new Date()

    const user = new User()
    user.name = data.name
    user.age = data.age
    user.phone = data.phone
    user.sex = data.sex
    user.password = hashCode(data.password)
    user.attendType = data.attendType
    user.expire = new Date(now.setDate(now.getDate() + 7))
    user.token = hashCode(user.password + user.expire)
    user.isSuperUser = false
    user.roomAssignment = roomAssignment
    user.groupAssignment = groupAssignment
    user.etc = data.etc
    user.createAt = now
    user.firstCome = userCount < 10
    user.deposit = false

    try{
        const savedUser = await userDatabase.save(user)
        res.send({result: 'success', token: user.token, userId: savedUser.id, firstCome: user.firstCome})
    }catch(e){
        console.log(e)
        res.send(e)
    }
})


router.post('/edit-user', async (req, res) => {
    const data = req.body

    userDatabase.save(data as User)
    res.send({result: 'success'})
})


router.post('/reset-password', async (req,res) => {
    const data = req.body

    const foundUser = await userDatabase.findOneBy({
        name: data.userName,
    })

    if(!foundUser){
        res.send({result: 'fail'})
    }else{
        foundUser.password = hashCode(data.userPassword)
        userDatabase.save(foundUser)
        res.send({result: 'success', userName: foundUser.name})
    }
})

router.post('/check-token', async (req, res) => {
    const data = req.body
    
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

    delete foundUser.password
    delete foundUser.expire
    delete foundUser.token

    const inoutInfoList = await attendInfoDatabase.findBy({
        user: foundUser
    })


    res.send({
        result: 'true',
        userData: foundUser,
        inoutInfoList,
    })
})


export default router