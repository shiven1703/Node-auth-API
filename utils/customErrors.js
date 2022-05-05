class InvalidPayload extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidPayload'
  }
}

class DBValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'DBValidationError'
  }
}

class InvalidUser extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidUser'
  }
}

module.exports = {
  InvalidPayload,
  InvalidUser,
  DBValidationError,
}
