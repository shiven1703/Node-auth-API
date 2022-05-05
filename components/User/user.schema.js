const userSchema = {
  type: 'object',
  properties: {
    firstname: {
      type: 'string',
    },
    lastname: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
    },
    role: {
      type: 'string',
    },
  },
  required: ['firstname', 'lastname', 'email', 'password', 'role'],
  additionalProperties: false,
}

module.exports = {
  userSchema,
}
