const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
  token_id: {
    type: String,
    required: true,
  },
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

refreshTokenSchema.index({ token_id: 1, user_id: 1 })
module.exports = mongoose.model('refreshToken', refreshTokenSchema)
