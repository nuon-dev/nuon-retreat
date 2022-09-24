import express from 'express'
import { hashCode } from '../util'
import {userDatabase} from '../model/dataSource'
import { User } from '../entity/user'
import AttendType from '../entity/attendType'

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
    user.name = data.userName
    user.age = data.userAge
    user.phone = data.userPhone
    user.sex = data.userSex
    user.password = hashCode(data.userPassword)
    user.attendType = AttendType.full
    user.token = hashCode(user.password)
    user.expire = new Date()

    try{
        await userDatabase.save(user)
    }catch(e){
        res.send(e)
    }
    res.send({result: 'success', token: user.token})
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

    if(foundUser.expire.getTime() < new Date().getTime()){
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