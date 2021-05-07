const mongoose = require('mongoose')

const RemainderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim : true
    },     
    scheduledDateTime: {
        type: Date,
        required: true,
        validate(value) {
            let now = new Date()
            
            if (value.getTime() < now.getTime()){
                throw new Error('Provide valid Future Date')
            }
               
        }
    },
    recur : {
        type: String,
        default : 'none',
        validate(value){
            allowed_values = ['daily','weekly','monthly', 'none']
            if (! allowed_values.includes(value.toLowerCase()) ){
                throw new Error('Provide Valid Recur option daily/weekly/monthly/none')
            }
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    }
    }, {
        timestamps: true
})

remainder = mongoose.model('remainder', RemainderSchema)

module.exports = remainder