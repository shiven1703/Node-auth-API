const bcrypt = require('bcryptjs')

const saltRounds = 10

const makeHash = async (data) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(data, salt)
    return `${salt}:${hash}`
  } catch (err) {
    throw err
  }
}

const validateHash = async (data, dataHash) => {
  try {
    const salt = dataHash.split(':')[0]
    const oldHash = dataHash.split(':')[1]
    const newHash = await bcrypt.hash(data, salt)

    if (newHash === oldHash) {
      return true
    } else {
      return false
    }
  } catch (err) {
    throw err
  }
}

module.exports = {
  makeHash,
  validateHash,
}
