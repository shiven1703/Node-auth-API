const schema = require('./user.schema')
const userDAL = require('./user.DAL.js')
const validator = require('../../utils/schemaValidator')

const createUser = async (req, res) => {
  try {
    const user = await validator.validate(schema.userSchema, req.body)
    await userDAL.addUser(user)
    res.status(201).json({
      msg: 'User created',
    })
  } catch (err) {
    if (err.name === 'InvalidPayload') {
      res.status(400).json({
        error: 'invalid payload',
        msg: err.message,
      })
    } else if (err.name === 'DBValidationError') {
      res.status(409).json({
        error: 'User already exist',
        msg: err.message,
      })
    } else {
      res.status(500).json({
        msg: 'internal server error',
      })
    }
  }
}

module.exports = {
  createUser,
}
