const cartRouter = require('express').Router()
const Cart = require('../models/order')


cartRouter.post('/cart', async (req, res) => {
    const { name, orders } = req.body;
    const username = req.username;
    console.log(username)
    const cart = new Cart({ username,name, orders });
    await cart.save();
    res.send(cart);
  });

module.exports = cartRouter