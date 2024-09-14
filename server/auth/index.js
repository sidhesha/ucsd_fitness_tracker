const passport = require('passport');
const User = require('../database/models/user');

// Use Google login strategy
const GoogleStrategy = require('./google')

// Serialize user object for session management
passport.serializeUser((user, done)=> {
  done(null, user.id)
});

// Deserialize user object for session management
passport.deserializeUser((id, done)=> {
  findUserById(id).then((user) => done(null, user))
});

async function findUserById(id) {
  const user = await User.findById(id)
  return user
}

passport.use(GoogleStrategy)

module.exports = passport
