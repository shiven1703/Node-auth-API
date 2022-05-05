const { v4: uuidv4 } = require('uuid')
const bluebird = require('bluebird')
const jwt = require('jsonwebtoken')
const { DateTime } = require('luxon')

// models
const User = require('./model/user')
const refreshToken = require('./model/refresh_token')

// extra
const config = require('config')
const encypter = require('../../utils/encryption')
const { DBValidationError, InvalidUser } = require('../../utils/customErrors')

// promise conversion
const jwtSignAsync = bluebird.promisify(jwt.sign)

const addUser = async ({ firstname, lastname, email, password, role }) => {
  try {
    const newUser = new User({
      firstname,
      lastname,
      email,
      password,
      role,
    })
    newUser.password = await encypter.makeHash(newUser.password)
    const user = await newUser.save()
    return user
  } catch (err) {
    if (err.code === 11000) {
      throw new DBValidationError('User already exist with same email address.')
    } else if (err.errors.role.kind === 'enum') {
      throw new DBValidationError(err.errors.role.message)
    } else {
      throw err
    }
  }
}

const authenticateUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email: email })
    if (user) {
      const isValidPassword = await validateUserPassword(
        password,
        user.password
      )
      if (isValidPassword) {
        const token = generateAccessToken(user)
        return token
      }
    }
    throw new InvalidUser('Invalid Username or password.')
  } catch (err) {
    throw err
  }
}

const validateUserPassword = async (userPassword, passwordHash) => {
  try {
    const isValidPassword = await encypter.validateHash(
      userPassword,
      passwordHash
    )
    return isValidPassword
  } catch (err) {
    throw err
  }
}

const generateAccessToken = async ({ _id: user_id, role }) => {
  try {
    user_id = user_id.toString()

    const access_token = await jwtSignAsync(
      {
        user_id: user_id,
        role: role,
      },
      config.get('modules.user.token.private_key'),
      { expiresIn: config.get('modules.user.token.access_token.exp_time') }
    )

    const tokenId = uuidv4()
    let refresh_token = await jwtSignAsync(
      {
        token_id: tokenId,
        user_id: user_id,
        role: role,
      },
      config.get('modules.user.token.private_key'),
      { expiresIn: config.get('modules.user.token.refresh_token.exp_time') }
    )

    // adding refToken to db

    const refTokenHash = await encypter.makeHash(refresh_token)
    const refExpiration = DateTime.now().plus({ hours: 1 }).toUnixInteger()

    const refToken = new refreshToken({
      token_id: tokenId,
      user_id: user_id,
      token: refTokenHash,
      expiration: refExpiration,
    })

    await refToken.save()

    return {
      access_token: `Bearer ${access_token}`,
      refresh_token: `Bearer ${refresh_token}`,
    }
  } catch (err) {
    throw err
  }
}

module.exports = {
  addUser,
  authenticateUser,
}
