// User Model

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/*
SCHEMA
email, password, tokens, name
*/


const UserSchema = new mongoose.Schema({    
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error('Provide a valid email ID')
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        validate(value) {
            if (value.toLowerCase().includes('password', 0))
                throw new Error('Password cannot contain password')
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    name: {
        type: String,
        required: true
        }
    }, {
        timestamps: true
})

// set foreign key and primary key with Remainder (one to many rel) 
UserSchema.virtual('remainder', {
    ref: 'remainder',
    localField: '_id',
    foreignField: 'author'
})


// implicitly gets called while res.send()
UserSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

// generate Auth Token
UserSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toHexString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// helper function
UserSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('unable to login')
    }

    return user
}

// middleware
UserSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

User = mongoose.model('users', UserSchema)

module.exports = User

