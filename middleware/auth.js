// middleware using JWT authentication


const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async(req, res, next) => {
    try {
        // parse token from authourization header
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        // append to request the user and the token
        req.token = token
        req.user = user
        next()
    } catch (e) {
        // bad token or no token
        res.status(401).send({ error: 'Verify Authentication !' })
    }

}

module.exports = auth