const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', (request, response) => {
    User.find({})
        .then(users => {
            response.json(users)
        })
})

usersRouter.get('/:id', async (request, response, next) => {
    User.findById(request.params.id)
        .then(user => {
            if (user) {
                response.json(user.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})




module.exports = usersRouter