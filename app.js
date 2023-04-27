const express = require('express')
require('express-async-errors')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()
const stationsRouter = require('./routers/stations')
const usersRouter = require('./routers/users')
const authRouter = require('./routers/auth')
const menuRouter = require('./routers/menu')

const middleware = require('./middleware')

const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

app.use(bodyParser.json())
app.use(cors())

app.use('/api/users', authRouter)


app.use(middleware.authorizeToken)

app.use('/api', stationsRouter)
app.use('/api/users', usersRouter)
app.use('/api', menuRouter)


module.exports = app