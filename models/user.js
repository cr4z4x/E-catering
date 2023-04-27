const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const userSchema = new mongoose.Schema({
    name: String,
    dob: String,
    username: String,
    phone: String,
    email: String,
    gender: String,
    passwordHash: String
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})


module.exports = mongoose.model('User', userSchema)
