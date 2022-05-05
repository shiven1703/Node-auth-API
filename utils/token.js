const bluebird = require('bluebird')
const jwt = require('jsonwebtoken')

const config = require('config')
const { JwtError } = require('../utils/customErrors')

const jwtVerifyAsync = bluebird.promisify(jwt.verify)

const verifyAccessToken = async (token) => {
  try {
    const accessToken = await jwtVerifyAsync(
      token,
      config.get('modules.user.token.private_key')
    )
    return accessToken
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new JwtError('Access token expired.')
    } else if (err.name === 'JsonWebTokenError') {
      throw new JwtError('Invalid access token')
    } else if (err.name === 'SyntaxError') {
      throw new JwtError('Invalid access token')
    } else {
      throw err
    }
  }
}

const verifyRefreshToken = async (token) => {
  try {
    const refreshToken = await jwtVerifyAsync(
      token,
      config.get('modules.user.token.private_key')
    )
    return refreshToken
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new JwtError('Access token expired.')
    } else if (err.name === 'SyntaxError') {
      throw new JwtError('Invalid access token')
    } else if (err.name === 'JsonWebTokenError') {
      throw new JwtError('Invalid access token')
    } else {
      throw err
    }
  }
}

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
}
