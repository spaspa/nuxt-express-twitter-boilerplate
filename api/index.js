require('dotenv').config()
const express = require('express')

// Create express instnace
const app = express()
const session = require('express-session')

// app.use(express.logger())
// app.use(express.bodyParser())
// app.use(express.cookieParser())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxage: 1000 * 60 * 30
  }
}))

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
app.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

// Require API routes
const auth = require('./routes/auth')
const twitter = require('./routes/twitter')
const users = require('./routes/users')

// Import API Routes
app.use(auth)
app.use(twitter)
app.use(users)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
