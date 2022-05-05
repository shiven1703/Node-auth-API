const User = require('./model/user')
const encypter = require('../../utils/encryption')
const { DBValidationError } = require('../../utils/customErrors')

const addUser = async ({ firstname, lastname, email, password, role }) => {
  try {
    const newUser = new User({
      firstname,
      lastname,
      email,
      password,
      role,
    })
    newUser.password = await encypter.makeHash(newUser.password)
    const user = await newUser.save()
    return user
  } catch (err) {
    if (err.code === 11000) {
      throw new DBValidationError('User already exist with same email address.')
    } else if (err.errors.role.kind === 'enum') {
      throw new DBValidationError(err.errors.role.message)
    } else {
      throw err
    }
  }
}

module.exports = {
  addUser,
}
