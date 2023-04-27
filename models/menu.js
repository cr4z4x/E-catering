const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const menuSchema = new mongoose.Schema({
    dishname: String,
    image: String,
    price: String
})

menuSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Menu', menuSchema)
