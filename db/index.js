const mongoose = require('mongoose')

const connectToDatabase = () => {
  return new Promise(async (resolve, reject) => {
    await mongoose
      .connect(process.env.MONGO_URL, {
        useUnifiedTopology: true,
        autoIndex: true,
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
