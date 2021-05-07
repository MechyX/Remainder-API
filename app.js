const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./db/connection')
const userRouter = require('./routes/user')
const indexRouter = require('./routes/index')
const child_process = require('child_process')

// create express app
const app = express()

// Load config 
dotenv.config({path : './config/config.env'})

// connect to DB
connectDB()

// set content type to JSON
app.use(express.json())

// mount routes
app.use(userRouter)
app.use(indexRouter)

// port 3000 or port mentioned in config
const PORT = process.env.PORT || 3000

// create child process to handle email service
daemon = child_process.fork('./daemons/mail_service.js')
daemon.send('intialize')
daemon.send('start')
daemon.on('message',(message => {
    console.log(message)
}))

// listen
app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on ${PORT}`))

