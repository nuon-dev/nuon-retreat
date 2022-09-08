const express = require('express')
const app = express()
const port = 3000

let mysqlConnection

initServer()

app.get('/', (req, res) => {
  res.send('Hello World!')
  mysqlConnection.query('show tables;', (error, rows, fields) => {
    if (error) throw error;
    console.log('User info is: ', rows);
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




function initServer() {
    connetMysql()
}

function connetMysql() {
    const dotenv = require('dotenv')
    dotenv.config()
     
    const mysql = require('mysql')
    mysqlConnection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: 3306,
    });
    mysqlConnection.connect()
}
