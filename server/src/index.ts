import express from 'express'
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
    user.password = hashCode(data.userPassword)
    user.attendType = AttendType.full
    user.token = hashCode(user.password + new Date().getTime())

    console.log(hashCode(user.password))
    try{
        //await userRepository.save(user)
    }catch(e){
        res.send(e)
    }
    res.send({result: 'success', token: user.token})
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
        userRepository.save(foundUser)
        res.send({result: 'success', token: foundUser.token})
    }
})