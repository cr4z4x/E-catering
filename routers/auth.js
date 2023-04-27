const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const authRouter = require('express').Router()
const User = require('../models/user')
require('dotenv').config()




authRouter.post('/register', async (request, response, next) => {
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

authRouter.post('/login', async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;
        const user = await User.findOne({
            email: email
        });

        const passwordCorrect = user === null ?
            false :
            await bcrypt.compare(password, user.passwordHash)

        if (!(user && passwordCorrect)) {
            return res.status(401).json({
                error: 'invalid username or password'
            })
        }

        const userForToken = {
            username: user.username,
            id: user._id,
        }

        const token = jwt.sign(userForToken, process.env.SECRET)

        res.status(200).send({
                token,
                username: user.username,
                name: user.name
            })

    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
});

module.exports = authRouter