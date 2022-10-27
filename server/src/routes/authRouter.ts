import express from 'express'
import { hashCode, isTokenExpire } from '../util'
import {userDatabase} from '../model/dataSource'
import { User } from '../entity/user'
import AttendType from '../entity/attendType'
import { RoomAssignment } from '../entity/roomAssignment'

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
        expireDay.setDate(expireDay.getDate() + 1)
        foundUser.expire = expireDay
        userDatabase.save(foundUser)
        res.send({result: 'success', token: foundUser.token})
    }
})

router.post('/join', async (req, res) => {
    const data = req.body

    const user = new User()
    user.name = data.name
    user.age = data.age
    user.phone = data.phone
    user.sex = data.sex
    user.password = hashCode(data.password)
    user.attendType = AttendType.full
    user.token = hashCode(user.password)
    user.expire = new Date()
    user.isSuperUser = false
    user.roomAssignment = new RoomAssignment()

    try{
        const savedUser = await userDatabase.save(user)
        res.send({result: 'success', token: user.token, userId: savedUser.id})
    }catch(e){
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
        token: data.token
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

    res.send({
        result: 'true',
        userData: foundUser,
    })
})


export default router