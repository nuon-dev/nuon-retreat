import express from 'express'
import { User } from "./entity/user"
import bodyParser from 'body-parser'
import apiRouter from './routes'
import dataSource from './model/dataSource'

const app = express()
const port = 8000

app.use(bodyParser.json())

const router = express.Router()
app.use('/',apiRouter)

app.listen(port, async () => {
    await Promise.all([dataSource.initialize()]);
    console.log('start server')
})

app.get('/', async (req, res) => {
    res.send('running server')
})
