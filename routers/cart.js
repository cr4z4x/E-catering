const cartRouter = require('express').Router()
const Cart = require('../models/order')


cartRouter.post('/cart', async (req, res) => {
    const { name, orders } = req.body;
    const cart = new Cart({ name, orders });
    await cart.save();
    res.send(cart);
  });

module.exports = cartRouter