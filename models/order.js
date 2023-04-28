const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const orderSchema = new mongoose.Schema({
    dishName: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  });
  
  const cartSchema = new mongoose.Schema({
    username: String,
    name: {
      type: String,
      required: true
    },
    orders: [orderSchema]
  });
  

cartSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
  }
})

module.exports = mongoose.model('cart', cartSchema)

