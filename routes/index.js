const userComponent = require('../components/User')
const errorHandler = require('../middleware/error')

module.exports = (app) => {
  app.use('/user', userComponent)
  app.use(errorHandler)
}
