const bcrypt = require('bcrypt')

const saltRounds = 10

const makeHash = async (data) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(data, salt)
    return hash
  } catch (err) {
    throw err
  }
}

const validateHash = async (data, hash) => {
  try {
    const isValidHash = await bcrypt.compare(data, hash)
    return isValidHash
  } catch (err) {
    throw err
  }
}

module.exports = {
  makeHash,
  validateHash,
}
