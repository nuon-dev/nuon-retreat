import express from 'express'
import { DataSource } from "typeorm"
import { User } from "./entity/user"
import bodyParser from 'body-parser'
import AttendType from './entity/attendType'
import dotenv from 'dotenv'

const app = express()
const port = 8000
const dataSource = new DataSource(require('../ormconfig.json'))
const env = dotenv.config().parsed


app.use(bodyParser.json())

app.listen(port, async () => {
    await Promise.all([dataSource.initialize()]);
    console.log('start server')
    console.log(env.HASH_KEY)
})

app.get('/', async (req, res) => {
    res.send({name: 'iubns'})
    const userRepository = dataSource.getRepository(User)

    const user = new User()

})
app.get('/test', async (req, res) => {
    res.send({name: 'test'})
    const userRepository = dataSource.getRepository(User)

    const user = new User()

})

app.post('/regist-user', async (req, res) => {
    const userRepository = dataSource.getRepository(User)
    const data = req.body

    const user = new User()
    user.name = data.userName
    user.age = data.userAge
    user.phone = data.userPhone
    user.sex = data.userSex
    user.password = data.userPassword
    user.attendType = AttendType.full

    console.log(data)
    try{
        await userRepository.save(user)
    }catch(e){
        res.send(e)
    }
    res.send({result: 'success'})
})

app.get('/all-user', async (req, res) => {
    const userRepository = dataSource.getRepository(User)
    res.send(await userRepository.find())
})