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
        error: err.message,
      })
    } else if (err.name === 'DBValidationError') {
      res.status(409).json({
        error: err.message,
      })
    } else {
      res.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }
}

const userLogin = async (req, res) => {
  try {
    const loginData = await validator.validate(schema.loginSchema, req.body)
    const tokens = await userDAL.authenticateUser(loginData)
    res.status(200).json(tokens)
  } catch (err) {
    if (err.name === 'InvalidPayload') {
      res.status(400).json({
        error: err.message,
      })
    } else if (err.name === 'InvalidUser') {
      res.status(401).json({
        error: err.message,
      })
    } else {
      console.log(err)
      res.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }
}

module.exports = {
  createUser,
  userLogin,
}
