const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

const isLoggedIn = (req, res, next) => {
    try {
        const authToken = req.headers.authorization
        const decoded = jwt.verify(authToken, keys.JWT_KEY)
        req.userData = decoded
        next()
    } catch(error){
        return res.status(401).json({msg: "Authentication Failed"})
    }
}

module.exports = isLoggedIn