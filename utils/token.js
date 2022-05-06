const bluebird = require('bluebird')
const jwt = require('jsonwebtoken')

const config = require('config')
const { JwtError } = require('../utils/customErrors')

const jwtSignAsync = bluebird.promisify(jwt.sign)
const jwtVerifyAsync = bluebird.promisify(jwt.verify)

const generateAccessToken = async (data) => {
  try {
    const access_token = await jwtSignAsync(
      data,
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: config.get('modules.user.token.access_token.exp_time') }
    )
    return access_token
  } catch (err) {
    throw err
  }
}

const generateRefreshToken = async (data) => {
  try {
    let refresh_token = await jwtSignAsync(
      data,
      process.env.REFRESH_TOKEN_KEY,
      { expiresIn: config.get('modules.user.token.refresh_token.exp_time') }
    )
    return refresh_token
  } catch (err) {
    throw err
  }
}

const verifyAccessToken = async (token) => {
  try {
    const accessToken = await jwtVerifyAsync(
      token,
      process.env.ACCESS_TOKEN_KEY
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
      process.env.REFRESH_TOKEN_KEY
    )
    return refreshToken
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new JwtError('Refresh token expired.')
    } else if (err.name === 'SyntaxError') {
      throw new JwtError('Invalid refresh token')
    } else if (err.name === 'JsonWebTokenError') {
      throw new JwtError('Invalid refresh token')
    } else {
      throw err
    }
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
}
