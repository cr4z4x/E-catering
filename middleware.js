const jwt = require('jsonwebtoken')
require('dotenv').config()


function authorizeToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    console.log('Authorized')
    req.id = decodedToken.id
    req.username = decodedToken.username
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

module.exports = {authorizeToken}