const bluebird = require('bluebird')
const jwt = require('jsonwebtoken')

// extra
const token = require('../utils/token')
const { MissingHeader, HttpError } = require('../utils/customErrors')

module.exports = (allowedRoles) => {
  return async (req, res, next) => {
    let receivedToken = req.headers.authorization

    try {
      if (receivedToken) {
        receivedToken = req.headers.authorization.startsWith('Bearer ')
        receivedToken = req.headers.authorization.split(' ')[1]
        const accessToken = await token.verifyAccessToken(receivedToken)

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
      next(err)
    }
  }
}
