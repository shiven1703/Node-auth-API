const cron = require('node-cron')

const config = require('config')
const userDAL = require('../components/User/user.DAL')

const removeExpiredRefreshTokens = async () => {
  await userDAL.clearExpiredRefreshTokens()
  console.log('clean up ran...')
}

module.exports = () => {
  cron.schedule('* * * * *', removeExpiredRefreshTokens, {
    timezone: config.get('crons.timezone'),
  })
}
