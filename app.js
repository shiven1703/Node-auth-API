const express = require('express')

const middleware = require('./middleware')
const routes = require('./routes')
const docs = require('./docs')

const app = express()

middleware(app)

docs(app)

routes(app)

module.exports = app
