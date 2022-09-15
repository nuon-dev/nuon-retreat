import express from 'express'
import { DataSource } from "typeorm"
import { User } from "./entity/user"
import bodyParser from 'body-parser'

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

app.post('/regist-user', (req, res) => {
    const userRepository = dataSource.getRepository(User)
    //const user = new User()
    console.log(req.method, req.body)
    res.send({result: 'success'})
})