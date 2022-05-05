const mongoose = require('mongoose')
const config = require('config')

const connectToDatabase = () => {
  return new Promise(async (resolve, reject) => {
    await mongoose
      .connect(config.get('database.mongoUrl'), {
        useUnifiedTopology: true,
        autoIndex: false,
        maxPoolSize: 50,
        serverSelectionTimeoutMS: 2000,
      })
      .catch((err) => {
        console.log('Database connection error...')
        reject()
      })
    resolve()
  })
}

module.exports = connectToDatabase
