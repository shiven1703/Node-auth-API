const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiration: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('user', userSchema)
