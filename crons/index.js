const cron = require('node-cron')

const config = require('config')
const userDAL = require('../components/User/user.DAL')

const removeExpiredRefreshTokens = async () => {
  await userDAL.clearExpiredRefreshTokens()
  console.log('clean up ran...')
}

module.exports = () => {
  // runs every hours
  cron.schedule('0 * * * *', removeExpiredRefreshTokens, {
    timezone: config.get('crons.timezone'),
  })
}
