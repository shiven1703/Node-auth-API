const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

module.exports = (app) => {
  app.use(helmet())

  app.use(cors())

  app.use(express.json())

  app.use(express.urlencoded({ extended: false }))
}
