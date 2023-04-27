const bcrypt = require('bcrypt')
const registerRouter = require('express').Router()
const User = require('../models/user')



registerRouter.post('/register', async (request, response, next) => {
    const body = request.body

    if (Object.keys(body).length === 0) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const emailExists = await User.exists({
        email: body.email
    });
    if (emailExists) {
        return response.status(400).json({
            error: 'user with this email already exists'
        });
    }

    const user = new User({
        "name": body.name,
        "dob": body.dob,
        "username": body.username,
        "phone": body.phone,
        "gender": body.gender,
        "email": body.email,
        "passwordHash": passwordHash

    })


    const savedUser = await user.save()
    response.json(savedUser)
})


module.exports = registerRouter