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

  cartRouter.get('/cart', async (req, res) => {
    let total = 0;
    const cart = await Cart.findOne({
        username: req.username
    });

    let {username,name,orders } = cart;

    orders.forEach(order => {
      total += order.price * order.quantity;
    });
    res.json({ username,name,total, orders });
  });

module.exports = cartRouter