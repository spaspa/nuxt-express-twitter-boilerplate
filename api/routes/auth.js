const { Router } = require('express')

const router = Router()

const oauth = new (require('oauth').OAuth)(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  process.env.TWITTER_CONSUMER_KEY,
  process.env.TWITTER_CONSUMER_SECRET,
  '1.0',
  'http://localhost:3000/api/auth/callback',
  'HMAC-SHA1'
)

router.get('/auth', function (req, res) {
  oauth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
    if (error) {
      res.send(error)
    }
    else {
      req.session.oauth = {}
      req.session.oauth.token = oauth_token
      req.session.oauth.token_secret = oauth_token_secret
      res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token)
    }
  })
})

router.get('/auth/callback', function (req, res) {
  if (req.session.oauth) {
    req.session.oauth.verifier = req.query.oauth_verifier

    oauth.getOAuthAccessToken(
      req.session.oauth.token,
      req.session.oauth.token_secret,
      req.session.oauth.verifier,
      function (error, oauth_access_token, oauth_access_token_secret, results) {
        if (error) {
          res.send(error)
        }
        else {
          req.session.oauth.access_token = oauth_access_token
          req.session.oauth.access_token_secret = oauth_access_token_secret
          req.session.user_profile = results
          res.redirect('/')
        }
      })
  }
})

module.exports = router
