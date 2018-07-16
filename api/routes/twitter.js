const { Router } = require('express')

const router = Router()

const Twitter = require('twitter')

const client = req => new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: req.session.oauth.access_token,
  access_token_secret: req.session.oauth.access_token_secret
})

router.get('/twitter/*', function (req, res, next) {
  if (req.session && !req.session.oauth) {
    res.status(401).send('unauthorized')
  }
  client(req).get(req.params['0'], req.query)
    .then(response => {
      res.json(response)
    })
    .catch(err => {
      console.log(err)
      next(err)
    })
})

module.exports = router
