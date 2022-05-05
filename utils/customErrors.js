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

module.exports = {
  InvalidPayload,
  DBValidationError,
}
