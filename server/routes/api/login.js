const express = require('express');
const router = express.Router();
const passport = require('../../auth');
const requireText = require('require-text');
const redirectPage = requireText('./redirect.html', require);

/* /api/login/* endpoint controllers */
router.get('/google', (req, res, next) => {
  if (req.user) {
    res.setHeader('Content-Type', 'text/html');
    res.send(redirectPage);
  } else {
    next();
  }
}, passport.authenticate('google', {
  failWithError: true
}), (err, req, res, next) => {
  res.status(400);
  res.send(`Google OAuth Login error: ${err.name}`);
}, (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(redirectPage);
});
router.get('/', function (req, res) {
  res.redirect('/api/login/google');
});

module.exports = router;
