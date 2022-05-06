const { v4: uuidv4 } = require('uuid')
const { DateTime } = require('luxon')

// models
const User = require('./model/user')
const refreshToken = require('./model/refresh_token')

// extra
const config = require('config')
const encypter = require('../../utils/encryption')
const token = require('../../utils/token')
const {
  DBValidationError,
  InvalidUser,
  HttpError,
} = require('../../utils/customErrors')

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
        const tokens = generateTokens(user)
        return tokens
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

const generateTokens = async ({ _id: user_id, role }) => {
  try {
    user_id = user_id.toString()

    const access_token = await token.generateAccessToken({
      user_id: user_id,
      role: role,
    })

    const tokenId = uuidv4()
    const refresh_token = await token.generateRefreshToken({
      token_id: tokenId,
      user_id: user_id,
      role: role,
    })
    // adding refToken to db
    const refExpiration = DateTime.now().plus({ hours: 1 }).toUnixInteger()

    const refToken = new refreshToken({
      token_id: tokenId,
      user_id: user_id,
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

const refreshUserTokens = async (OldrefreshToken) => {
  try {
    const deleteQuery = await refreshToken.deleteOne({
      token_id: OldrefreshToken.token_id,
    })

    if (deleteQuery.deletedCount === 1) {
      const newTokenPair = await generateTokens({
        _id: OldrefreshToken.user_id,
        role: OldrefreshToken.role,
      })
      return newTokenPair
    } else {
      throw new HttpError('Invalid refresh token', 401)
    }
  } catch (err) {
    throw err
  }
}

module.exports = {
  addUser,
  authenticateUser,
  refreshUserTokens,
}
