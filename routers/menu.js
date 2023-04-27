const menuRouter = require('express').Router()
const Menu = require('../models/menu')

menuRouter.get('/Menu', (request, response) => {
    Menu.find({})
        .then(users => {
            response.json(users)
        })
})

module.exports = menuRouter