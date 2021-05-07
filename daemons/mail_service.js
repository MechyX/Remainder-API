// Seperate process to send emails

const Remainder = require('../models/Remainder')
const User = require('../models/users')
const connectDB = require('../db/connection')
const nodemailer = require('nodemailer')
var cron = require('node-cron')

// transporter options
var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: process.env.SERVICE_EMAIL,
        pass: process.env.SERVICE_EMAIL_PWD
      } 
    })


// send email function
const sendEmailRemainder = function (destAddr, remainder, name) {
    var mailSubject = "Remainder - " + remainder.name
    var body = remainder.description + "\nremainder scheduled at : " + remainder.scheduledDateTime
    html = `<h1>Hello ${name} Here is a remainder you set</h1> <p>${body}</p> <p> Powered By RemaindersApp </p>`
    var mailOptions = {
        from: "zmechy2001@gmail.com",
        to: destAddr,
        subject: mailSubject ,
        html : html
    };

    //sending the mail
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    }

    else {
        console.log('Email sent: ' + info.response);
    }
    })
}

// queries the db to check for remainders to send
const check_remainder = async () => {
    // time offset - 1 min from current time
    now_lower = new Date()
    now_upper = new Date()
    now_lower.setMinutes( now_lower.getMinutes() - 1)
    now_upper.setMinutes( now_upper.getMinutes() + 1)

    remainders = await Remainder.find({
        'scheduledDateTime' : {$gte: now_lower, $lt: now_upper}}
        , null, {sort: { 'scheduledDateTime' : 'asc' }})
    
        if (remainders.length === 0){
        console.log('No remainders in specified range')
    }
    // for all remainders that is queried send the email
    else{
        for(let remainder of remainders){
            author_id = remainder.author
            author = await User.findOne({'_id' : author_id})
            if(!author){
                continue   
            }
            
            destAddr = author.email
            // send email
            sendEmailRemainder(destAddr, remainder, author.name)
            
            // Change scheduledTime if recur is provided
            let day = 24*3600*1000
            if (remainder.recur === 'daily'){
                remainder.scheduledDateTime = remainder.scheduledDateTime.getTime() + day
                console.log(remainder.scheduledDateTime)
            }
            else if(remainder.recur === 'weekly'){
                remainder.scheduledDateTime = remainder.scheduledDateTime.getTime() + day*7
            }
            else if(remainder.recur === 'monthly'){
                let date = remainder.scheduledDateTime
                remainder.scheduledDateTime = new Date(date.getFullYear(), date.getMonth() + 1, 
                                                date.getDate(), date.getHours(), date.getMinutes());
            }
            else{
                continue
            }
    
            try{
                await remainder.save()
            } catch(e){
                console.log(e)
            }
        }
  
    }
}

// Event listener (parent <-> child) un-named pipe
process.on('message',(async (message) => {
    if (message === 'intialize'){
        console.log('Intializing DB in child process')
        connectDB()
    }
    
    // call check_remainder every one min
    if (message === 'start'){
        cron.schedule('*/1 * * * *', () => {
            check_remainder()
        });
    }
}))