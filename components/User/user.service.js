const schema = require('./user.schema')
const userDAL = require('./user.DAL.js')
const validator = require('../../utils/schemaValidator')
const token = require('../../utils/token')
const { MissingHeader } = require('../../utils/customErrors')

const createUser = async (req, res, next) => {
  try {
    const user = await validator.validate(schema.userSchema, req.body)
    const newUser = await userDAL.addUser(user)
    res.status(201).json({
      msg: 'User created',
      data: {
        User: newUser,
      },
    })
  } catch (err) {
    next(err)
  }
}

const userLogin = async (req, res, next) => {
  try {
    const loginData = await validator.validate(schema.loginSchema, req.body)
    const tokens = await userDAL.authenticateUser(loginData)
    res.status(200).json(tokens)
  } catch (err) {
    next(err)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    let receivedToken = req.headers.authorization
    if (receivedToken) {
      receivedToken = req.headers.authorization.startsWith('Bearer ')
      receivedToken = req.headers.authorization.split(' ')[1]

      const refreshTokenData = await token.verifyRefreshToken(receivedToken)
      const newTokenPair = await userDAL.refreshUserTokens(refreshTokenData)
      res.status(200).json(newTokenPair)
    } else {
      throw new MissingHeader(
        'Auhtnetication header not found in the request header.'
      )
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createUser,
  userLogin,
  refreshToken,
}
