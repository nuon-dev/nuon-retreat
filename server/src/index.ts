import express, { application } from 'express'
import { DataSource } from "typeorm"
import { User } from "./entity/user"
import bodyParser from 'body-parser'
import AttendType from './entity/attendType'
import { hashCode } from './util'

const app = express()
const port = 8000
const dataSource = new DataSource(require('../ormconfig.json'))

app.use(bodyParser.json())

app.listen(port, async () => {
    await Promise.all([dataSource.initialize()]);
    console.log('start server')
})

app.get('/', async (req, res) => {
    res.send('running server')
})

app.post('/regist-user', async (req, res) => {
    const userRepository = dataSource.getRepository(User)
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
        await userRepository.save(user)
    }catch(e){
        res.send(e)
    }
    res.send({result: 'success', token: user.token})
})

app.post('/edit-user', async (req, res) => {
    const userRepository = dataSource.getRepository(User)
    const data = req.body

    userRepository.save(data as User)
    res.send({result: 'success'})
})

app.get('/all-user', async (req, res) => {
    const userRepository = dataSource.getRepository(User)
    res.send(await userRepository.find())
})

app.post('/login', async (req, res) => {
    const data = req.body

    const userRepository = dataSource.getRepository(User)
    const foundUser = await userRepository.findOneBy({
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
        userRepository.save(foundUser)
        res.send({result: 'success', token: foundUser.token})
    }
})

app.post('/reset-password', async (req,res) => {
    const data = req.body

    const userRepository = dataSource.getRepository(User)
    const foundUser = await userRepository.findOneBy({
        name: data.userName,
    })

    if(!foundUser){
        res.send({result: 'fail'})
    }else{
        foundUser.password = hashCode(data.userPassword)
        userRepository.save(foundUser)
        res.send({result: 'success', userName: foundUser.name})
    }
})

app.post('/check-token', async (req, res) => {
    const data = req.body
    
    const userRepository = dataSource.getRepository(User)
    const foundUser = await userRepository.findOneBy({
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