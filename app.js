const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./db/connection')
const userRouter = require('./routes/user')
const indexRouter = require('./routes/index')
const child_process = require('child_process')

const app = express()

// Load config 
dotenv.config({path : './config/config.env'})

connectDB()


app.use(express.json())
app.use(userRouter)
app.use(indexRouter)


const PORT = process.env.PORT || 3000

daemon = child_process.fork('./daemons/mail_service.js')
daemon.send('intialize')
daemon.send('start')
daemon.on('message',(message => {
    console.log(message)
}))


app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on ${PORT}`))

