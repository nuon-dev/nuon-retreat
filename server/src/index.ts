import express from 'express'
import { DataSource } from "typeorm"
import { User } from "./entity/user"

const app = express()
const port = 3000
const dataSource = new DataSource(require('../ormconfig.json'))

app.listen(port, async () => {
    await Promise.all([dataSource.initialize()]);
    console.log('start server')
})

app.get('/', async (req, res) => {
    res.send("hello world!")
    const userRepository = dataSource.getRepository(User)

    const user = new User()

})

app.post('/add-user', async (req, res) => {
    const userRepository = dataSource.getRepository(User)
    //const user = new User()
    console.log(req.body)
    res.send('success')
})