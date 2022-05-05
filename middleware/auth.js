const bluebird = require('bluebird')
const jwt = require('jsonwebtoken')

// extra
const config = require('config')
const { MissingHeader, JwtError, HttpError } = require('../utils/customErrors')

// promisification of jwt verify method
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
      // console.log(err)
      throw new JwtError('Invalid access token')
    } else {
      throw err
    }
  }
}

module.exports = (allowedRoles) => {
  return async (req, res, next) => {
    let receivedToken = req.headers.authorization.startsWith('Bearer ')

    try {
      if (receivedToken) {
        receivedToken = req.headers.authorization.split(' ')[1]
        const accessToken = await verifyAccessToken(receivedToken)

        if (allowedRoles.includes(accessToken.role)) {
          req.user = {
            user_id: accessToken.user_id,
            role: accessToken.role,
          }
          return next()
        } else {
          throw new HttpError('Access Denied', 403)
        }
      } else {
        throw new MissingHeader(
          'Auhtnetication header not found in the request header.'
        )
      }
    } catch (err) {
      if (err.name === 'MissingHeader') {
        res.status(400).json({
          error: err.message,
        })
      } else if (err.name === 'JwtError') {
        res.status(401).json({
          error: err.message,
        })
      } else if (err.name === 'HttpError') {
        res.status(err.httpErrorCode).json({
          error: err.message,
        })
      } else {
        throw err
      }
    }
  }
}
